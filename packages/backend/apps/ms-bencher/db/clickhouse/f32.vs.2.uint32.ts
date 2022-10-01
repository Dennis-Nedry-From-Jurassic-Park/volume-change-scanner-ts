import {clickhouse_localhost as clickhouse, clickhouse_localhost} from "../../../ms-base/src/db/clickhouse/clickhouse";
import assert from "assert";
import {prettyJSON} from "../../../ms-ti-base/output";
import {asyncWriteFile, getAppRootDir} from "../../../ms-base/src/utility-methods/file";

const exec = async () => {
    const table_name = 'codec_test1_seq';

    await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name};`).toPromise();

    const create_table_all_c = `
        CREATE TABLE ${table_name} (
            n Int32,
            
            /* No compression */
            n32               Int32 default n Codec(NONE),
            n32_doubledelta   Int32 default n Codec(DoubleDelta),
            n32_t64           Int32 default n Codec(T64),
            n32_gorilla       Int32 default n Codec(Gorilla),
            f32               Float32 default n Codec(NONE),
            f64               Float64 default n Codec(NONE),
            f32_gorilla       Float32 default n Codec(Gorilla),
            f64_gorilla       Float64 default n Codec(Gorilla),
            
            /* LZ4 compression */
            l_n32             Int32 default n Codec(LZ4),
            l_n32_delta       Int32 default n Codec(Delta, LZ4),
            l_n32_doubledelta Int32 default n Codec(DoubleDelta, LZ4),
            l_n32_t64         Int32 default n Codec(T64, LZ4),
            l_n32_gorilla     Int32 default n Codec(Gorilla, LZ4),
            l_f32             Float32 default n Codec(LZ4),
            l_f32_gorilla     Float32 default n Codec(Gorilla, LZ4),
            
            /* ZSTD compression */
            z_n32             Int32 default n Codec(ZSTD),
            z_n32_delta       Int32 default n Codec(Delta, ZSTD),
            z_n32_doubledelta Int32 default n Codec(DoubleDelta, ZSTD),
            z_n32_t64         Int32 default n Codec(T64, ZSTD),
            z_n32_gorilla     Int32 default n Codec(Gorilla, ZSTD),
            z_f32             Float32 default n Codec(ZSTD),
            z_f32_gorilla     Float32 default n Codec(Gorilla, ZSTD)
        ) Engine = MergeTree
        PARTITION BY tuple() ORDER BY tuple();
    `;

    let resp = await clickhouse_localhost.query(create_table_all_c).toPromise();
    assert(resp['r'] === 1, `not ok. table ${table_name} not created.`)

    const insert_q =
        `insert into ${table_name} (n) select number from numbers(100000000) settings max_block_size=1000000;`
    assert(resp['r'] === 1, `not ok. insert to table ${table_name} failed.`)

    resp = await clickhouse_localhost.query(insert_q).toPromise();
    assert(resp['r'] === 1, `not ok. table ${table_name} not created.`)
    /*
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
        let json_resp = JSON.parse(resp.toString());
        console.table(json_resp);

     */

    let jsonObject = {

        'z_n32_doubledelta': [],//  46.85   0.31    64.5    0.44
        'l_n32_doubledelta': [],//  48.4    0.26    46      0.24
        'z_n32_delta': [], //       45.2    0.18    47.3    0.18  47.3  0.18
        'l_n32_delta': []   //      38.5    0.14    48.5    0.19  21.2  0.09
    };

    let Epochjs = require('epochjs'),
        epochjs = new Epochjs();
    for(const c of [              // 100 samples
        'z_n32_doubledelta',      // 50   0.31 882                      442.7 0.01     476.6 473.6
        'z_n32_delta',          // 49.3 0.24 859 + 1.4    -2.60771    506.7 0.01       502
        'l_n32_doubledelta',      // 43.7 0.25 828 + 12.56  -6.12244    511.6 0.01     385.3 497.5
        //'l_n32_delta'           // 41.7 0.21 203                      496   0.01
    ]){
        for(const n of range(1, 1000, 1)){
            epochjs.start();

            await clickhouse.query(`SELECT max(${c}) FROM ${table_name}`).toPromise();

            let elapsed = epochjs.secElapsed();
            jsonObject[c].push(elapsed);
            //console.log(`column = ${c} with elapsed = ${elapsed}`)
        }
    }

    //console.log(prettyJSON(jsonObject))

    await asyncWriteFile('f32_1000_3.log', prettyJSON(jsonObject))

    await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name};`).toPromise();


    // l_n32_delta          1.38 1.40 0.06 0.05 0.06
    // z_n32_delta          1.38 1.40 0.66 0.06 0.09
    // z_n32_doubledelta    0.12 0.12 1.63 0.12 0.12
    // l_n32_doubledelta    0.10 0.12 0.11 0.11 0.11

}

const range = (from, to, step): any[] =>
    Array.from({length: Math.floor((to - from) / step) + 1}, (v, i) => from + i * step)


const exec0 = async () => {
    console.log(range(1, 100, 1))
}


//const { rate } = require('../../../../dist/cjs/average-rating.js')
//
// import {
//     score,
//     rate,
//     average
// } from 'average-rating'

//
// const exec2 = async () => {
//     const range_1 = range_rand_f32(2)
//     const range_2 = range_rand_f32(2)
//     console.log(range_1)
//     console.log(range_2)
//     console.log(rate(range_1))
//     //console.log(rate(range_2))
//
//
//     var starRatings = require('star-ratings');
//
//     // [1-star-voters, 2-star-voters, 3-star-voters, 4-star-voters, ...]
//     var votes1 = range_1;
//     var votes2 = range_2;
//     var rating1 = starRatings(votes1);
//     var rating2 = starRatings(votes2);
//     console.log(rating1); // '3.8'
//     console.log(rating2); // '3.8'
//
// }

exec();

