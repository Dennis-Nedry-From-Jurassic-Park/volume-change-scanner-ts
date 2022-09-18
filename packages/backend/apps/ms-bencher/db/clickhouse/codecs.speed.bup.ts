//import clickhouse from "apps/ms-base/src/db/clickhouse/clickhouse";

import {clickhouse_localhost as clickhouse} from "../../../ms-base/src/db/clickhouse/clickhouse";
import assert from "assert";
import {LastPrice} from "tinkoff-invest-api/dist/generated/marketdata";
import {toNum} from "../../../ms-ti-base/number";

const { printTable } = require('console-table-printer');

const map: any[] = []


const exec = async () => {
    const rows = 100_000_000;
    const table_name = 'test_codec_speed_1'; // DROP TABLE default.test_codec_speed_1
    const type = 'UInt32';

    const codecs = [
        'LZ4',

        'Gorilla', 'Gorilla, ZSTD(6)', 'Gorilla, LZ4', 'Gorilla, LZ4HC(1)',

        'ZSTD(1)', 'ZSTD(3)', 'ZSTD(6)', 'ZSTD(8)', 'ZSTD(12)',

        'Delta, LZ4', 'Delta, ZSTD(1)',


        'T64, LZ4', 'T64, ZSTD(1)', 'T64, ZSTD(6)', 'T64, LZ4HC(1)',

        'DoubleDelta', 'DoubleDelta, LZ4', 'DoubleDelta, ZSTD(1)', 'DoubleDelta, LZ4HC(1)'
    ];
    // CODEC(LZ4) (same as default)
    // Delta, LZ4 is same as Delta(4), LZ4

    /*

    create table if not exists ${table_name} engine=MergeTree
            ORDER BY tuple()
            as select cast(now() + rand()%2000 + number, '${type}') as x from numbers(${rows});

     */

    const codecs2 = []


    for(const codec of codecs) {
        const create_table = `
            create table if not exists ${table_name} engine=MergeTree
            ORDER BY tuple()
            as select cast(number, '${type}') as x from numbers(${rows});
        `; // сжатие LZ4

        let resp = await clickhouse.query(create_table).toPromise();
        assert(resp['r'] === 1, `not ok. table ${table_name} not created.`)
        console.log(codec)
        const full_codec = codec === 'None' ? '' : `CODEC(${codec})`;
        const alter_query = `alter table ${table_name} modify column x ${type} ${full_codec};`
        resp = await clickhouse.query(alter_query).toPromise();
        console.log(resp)
        const optimize_query = `OPTIMIZE TABLE ${table_name} FINAL;`
        resp = await clickhouse.query(optimize_query).toPromise();
        console.log(resp)
        // let json_resp: any = JSON.parse(resp.toString());
        // const o_elapsed = json_resp.statistics.elapsed
        // console.log(json_resp)

        let query = `select max(x) as max from ${table_name}`;
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
                columnType: j2.type,
                compression_codec: j2.compression_codec,
                //data_compressed_bytes: j2.data_compressed_bytes,
                //data_uncompressed_bytes: j2.data_uncompressed_bytes,
                compr_rate_bytes: j2.data_uncompressed_bytes / j2.data_compressed_bytes,
                selectQueryElapsed: elapsed
                //codec: j2
            }
        });
        //printTable(final_result);

        _result.forEach((result:any) => {
            map.push(result)
        })
    }

   // console.table(map)

    const sorted_map = map.sort((a, b) => a.compr_rate_bytes - b.compr_rate_bytes)
    console.table(sorted_map)
}
exec().then(() => { console.log('clickhouse bencher done')})