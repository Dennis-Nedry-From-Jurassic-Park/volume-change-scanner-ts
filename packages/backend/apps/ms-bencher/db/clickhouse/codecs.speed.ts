//import clickhouse from "apps/ms-base/src/db/clickhouse/clickhouse";

import {clickhouse_localhost as clickhouse} from "../../../ms-base/src/db/clickhouse/clickhouse";
import assert from "assert";
import {LastPrice} from "tinkoff-invest-api/dist/generated/marketdata";
import {toNum} from "../../../ms-ti-base/number";
import {
    insert_into_table_multiple,
    insert_into_table_multiple_n
} from "../../../ms-base/src/db/generate-schema/own-clickhouse-generator-scheme";
import {delay} from "../../../ms-ti-base/wait";
import {asyncAppendToFile, asyncWriteFile, getAppRootDir} from "apps/ms-base/src/utility-methods/file";
import asTable from "as-table";

const table = require('table').table;


let map: any[] = []
//[...Array(Math.floor((to - from) / step) + 1).keys()].map((_, i) => from + i * step);
//[...Array(Math.floor((to - from) / step) + 1).keys()].map((_, i) => from + i * step);

const range = (from, to, step): any[] =>
    Array.from({length: Math.floor((to - from) / step) + 1}, (v, i) => from + i * step)
const range_rand = (rows): any[] =>
    Array.from({length: rows}, () => Math.floor(Math.random() * rows));

const range_f32 = (from, to, step): any[] =>
    Array.from({length: Math.floor((to - from) / step) + 1}, (v, i) => (from + i * step) * 1.0)
const range_rand_f32 = (rows): any[] =>
    Array.from({length: rows}, () => Math.random() * rows);

const mapToArray = (arr: any[] = []) => {
    const res: any[] = [];
    arr.forEach(function(obj,index){
        const key: any= Object.keys(obj)[0];
        const value: any = parseInt(key, 10);
        res.push([value, obj[key]]);
    });
    return res;
};


const exec = async () => {
    const rows = 100000;
    const table_name = 'test_codec_speed_1'; // DROP TABLE default.test_codec_speed_1
    const column = 'n';
    const type = 'UInt32'; // Int32 UInt32 Float32 Float64 DateTime64 DateTime

    const codecs = [
        'LZ4',

        'Gorilla', 'Gorilla, ZSTD(1)', 'Gorilla, ZSTD(3)', 'Gorilla, ZSTD(6)', 'Gorilla, LZ4', 'Gorilla, LZ4HC(1)',

        'ZSTD(1)', 'ZSTD(3)', 'ZSTD(6)', 'ZSTD(8)', 'ZSTD(12)',

        'Delta, LZ4', 'Delta, ZSTD(1)', 'Delta, ZSTD(3)', 'Delta, ZSTD(6)', 'Delta, LZ4HC(1)', 'Delta, LZ4HC(3)', 'Delta, LZ4HC(6)',

        'T64, LZ4', 'T64, ZSTD(1)', 'T64, ZSTD(3)', 'T64, ZSTD(6)', 'T64, LZ4HC(1)', 'T64, LZ4HC(3)', 'T64, LZ4HC(6)',

        'DoubleDelta', 'DoubleDelta, LZ4', 'DoubleDelta, ZSTD(1)', 'DoubleDelta, ZSTD(3)', 'DoubleDelta, ZSTD(6)', 'DoubleDelta, LZ4HC(1)', 'DoubleDelta, LZ4HC(3)'
    ];
    // CODEC(LZ4) (same as default)
    // Delta, LZ4 is same as Delta(4), LZ4

    /*

    create table if not exists ${table_name} engine=MergeTree
            ORDER BY tuple()
            as select cast(now() + rand()%2000 + number, '${type}') as x from numbers(${rows});

     */


    const generators = ['linear', 'rand'];

    for(const gen of generators) {
        for(const codec of codecs) {
            await clickhouse.query(`DROP TABLE IF EXISTS ${table_name}`).toPromise();

            const create_table = `
            CREATE TABLE IF NOT EXISTS ${table_name} (${column} ${type}) engine=MergeTree ORDER BY tuple()
        `; // сжатие LZ4

            let resp = await clickhouse.query(create_table).toPromise();
            assert(resp['r'] === 1, `not ok. table ${table_name} not created.`)
            console.log(codec)
            const alter_query = `alter table ${table_name} modify column ${column} ${type} CODEC(${codec});`
            resp = await clickhouse.query(alter_query).toPromise();
            //console.log(resp)
            const optimize_query = `OPTIMIZE TABLE ${table_name} FINAL;`
            await clickhouse.query(optimize_query).toPromise();

            const ins_rows = [...Array(rows).keys()].map((_, i) => 1 + i)
            console.log(ins_rows[rows-1])
            const insert_q = await insert_into_table_multiple_n(table_name, ins_rows)

            // `insert into ${table_name} (${column}) select number from numbers(${rows}) settings max_block_size=1000000;`
            //console.log(insert_q)

            let Epochjs = require('epochjs'),
                epochjs = new Epochjs();
            epochjs.start();

            const multiplier = 99; // 10 mi rows per table
            const rows_ = generate_rows_(rows, multiplier);

            for (const row of rows_) {
                // const ins_rows: any[] =

                let ins_rows: any[] = [];

                if(gen === 'linear'){
                    ins_rows = range(row.from, row.to, 1); // 1,2,3,4,5
                    //ins_rows = range_f32(row.from, row.to, 1); // 1,2,3,4,5
                } else if(gen === 'rand'){
                    ins_rows = range_rand(100000);         // 8,2,6,1,5
                    //ins_rows = range_rand_f32(50000);         // 8,2,6,1,5
                } else {
                    throw new Error('Invalid generator')
                }

                const insert_q = await insert_into_table_multiple_n(table_name, ins_rows)
                await clickhouse.query(insert_q).toPromise();
            }

            //console.log(resp)
            //let json_resp = JSON.parse(resp.toString());
            const insert_q_elapsed = epochjs.secElapsed()//json_resp.statistics.elapsed

            // let json_resp: any = JSON.parse(resp.toString());
            // const o_elapsed = json_resp.statistics.elapsed
            // console.log(json_resp)

            let query = `select max(${column}) as max from ${table_name}`;
            resp = await clickhouse.query(query).toPromise();
            let json_resp = JSON.parse(resp.toString());
            const elapsed = json_resp.statistics.elapsed
            // seconds

            const query_size_table = `
            SELECT
                table,
                formatReadableSize(sum(data_compressed_bytes) AS size) AS compressed,
                formatReadableSize(sum(data_uncompressed_bytes) AS usize) AS uncompressed,
                round(usize / size, 2) AS compr_rate,
                sum(rows) AS rows,
                count() AS part_count
            FROM system.parts
            WHERE (active = 1) AND (database LIKE 'default') AND (table LIKE '${table_name}')
            GROUP BY
                table
            ORDER BY size DESC;
        `;
            resp = await clickhouse.query(query_size_table).toPromise();
            json_resp = JSON.parse(resp.toString());
            //console.log(json_resp.data[0]);

            const q_codec = `
            SELECT
                type,
                data_compressed_bytes,
                data_uncompressed_bytes,
                compression_codec
            FROM system.columns
            WHERE table = '${table_name}'
        `;
            const resp22 = await clickhouse.query(q_codec).toPromise();
            const j2: any = JSON.parse(resp22.toString()).data[0];
            console.log(j2)

            const _result = json_resp.data.map( (obj:any) => {
                return {
                    ...obj,
                    //columnType: j2.type,
                    compression_codec: j2.compression_codec,
                    //data_compressed_bytes: j2.data_compressed_bytes,
                    //data_uncompressed_bytes: j2.data_uncompressed_bytes,
                    compr_rate_bytes: j2.data_uncompressed_bytes / j2.data_compressed_bytes,
                    selectQueryElapsed: elapsed,
                    insertQueryElapsed: insert_q_elapsed
                    //codec: j2
                }
            });
            //printTable(final_result);

            _result.forEach((result:any) => {
                map.push(result)
            })
        }

        let sorted_map: any[] = map.sort((a, b) => a.compr_rate_bytes - b.compr_rate_bytes);

        //const arr = [...sorted_map ].map(([key, value]) => ([key, value]))

        //console.log(sorted_map)
       // const ma = mapToArray(sorted_map);
        //console.log(ma);

        //const t = table(ma);

        let asTable = require ('as-table').configure({ delimiter: ' | ', right: true })
        const t=asTable(sorted_map)
       // console.log();

        const rootDir = getAppRootDir();
        const filename = rootDir+'/benchmark/'+type+'.log';
        await asyncAppendToFile(
            filename,
            '************************************************************************'
            + ' data generator: '
            + gen
            + ' ***********************************************************************\n'
            + t + '\n'
        );

        console.table(sorted_map)
        map = [];
        sorted_map = [];
    }
}
//exec().then(() => { console.log('clickhouse bencher done')})


const exec2 = async () => {
    console.time("Elapsed time :");

    const rows = 100_000;
    for (const row of [1, 2, 3]) {
        const ins_rows = [...Array(rows * row).keys()].map((_, i) => rows + i  * row)
        console.log('= '+ins_rows.at(0)+' '+ins_rows.at(-1))
    }

    await delay(500000)
    const query = await insert_into_table_multiple_n('test_codec_speed_1', [])
    //console.log(query)
    await clickhouse.query(query).toPromise();
    // https://clickhouse.com/docs/en/operations/settings/settings/
    console.timeEnd("Elapsed time :");
}


const exec3 = async () => {
    const rows = 10;
    const range = (from, to, step): any[] =>
        //[...Array(Math.floor((to - from) / step) + 1).keys()].map((_, i) => from + i * step);
        Array.from({length: Math.floor((to - from) / step) + 1}, (v, i) => from + i * step)
        //[...Array(Math.floor((to - from) / step) + 1).keys()].map((_, i) => from + i * step);

    for (const row of [
        { from: 1, to: rows },
        { from: rows+1, to: 2*rows }
    ]) {

        const arr: any[] = range(row.from, row.to, 1);
        console.log(arr)
        //console.log('= '+Array.of(arr))
        //console.log('= '+Array.of(arr).at[-1])
        //console.log('= '+arr.at[-1])

        // console.log(
        //     Array.from({length:5},(v,k)=>k+1)
        // )
    }



}


const generate_rows_ = (rows:number, multiplier: number): any[] => {
    let rows_: any[] = [];
    const multipliers = range(1, multiplier, 1)
    rows_.push({ from: 1, to: rows })
    for(const m of multipliers) {
        rows_.push({ from: m*rows+1, to: (m+1)*rows })
    }
    return rows_;
}

const randomInt= (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const exec5 = async () => {
    const type = 'int32'
    const gen = 'rand'
    const rootDir = getAppRootDir();
    const filename = rootDir+'/benchmark/'+type+'.log';
    //await asyncAppendToFile(filename, 'data generator: ' + gen + '\n')

    let map = new Map().set('a', 1).set('b', 2);

    //const arr = [...myMap].map(([name, value]) => ([ name, value ]));
    const arr = [...map ].map(([key, value]) => ([key, value]))

    console.log(arr);



    var obj2 = [{"t":5,"n":7,"e":0}, {"t":5,"n":7,"e":0}]
    //var result = Object.entries(obj);
    //console.log(result);

    console.log(mapToArray(obj2));


    let asTable = require ('as-table').configure({ delimiter: ' | ', right: true })

    console.log(asTable(obj2));



    // const arr22: any[] = obj2.map(function (obj) {
    //     return obj2;
    // });
    // console.log(arr22);
}
const execx = async () => {
    console.log(range_rand_f32(100))
}
const exec4 = async () => {
    //const num = randomInt(900000, 10000000);
    //console.log(num)
   // console.log(range_rand(10_000_000))
    console.log(range_rand_f32(10000 / 2))
    // [
    //     { from: 1, to: rows },
    //     { from: 1*rows+1, to: 2*rows },
    //     { from: 2*rows+1, to: 3*rows },
    //     { from: 3*rows+1, to: 4*rows },
    //     { from: 4*rows+1, to: 5*rows },
    //     { from: 5*rows+1, to: 6*rows },
    //     { from: 6*rows+1, to: 7*rows },
    //     { from: 7*rows+1, to: 8*rows },
    //     { from: 8*rows+1, to: 9*rows },
    //     { from: 9*rows+1, to: 10*rows },
    // ]
}
exec()//.then(() => { console.log('clickhouse bencher done')})