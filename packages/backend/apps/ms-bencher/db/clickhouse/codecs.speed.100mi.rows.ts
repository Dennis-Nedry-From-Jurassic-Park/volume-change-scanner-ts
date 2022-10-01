import {clickhouse_localhost as clickhouse} from "../../../ms-base/src/db/clickhouse/clickhouse";
import assert from "assert";


const exec = async () => {
    const rows = 100000;
    const table_name = 'test_codec_speed_111'; // DROP TABLE default.test_codec_speed_1
    const column = 'n';
    const type = 'UInt32'; // Int32 UInt32 Float32 Float64 DateTime64 DateTime

    const codecs = [
        // only codecs without compression
        'NONE', 'LZ4', 'LZ4HC', 'Gorilla', 'Delta',

         'Gorilla, ZSTD(1)', 'Gorilla, ZSTD(3)', 'Gorilla, ZSTD(6)', 'Gorilla, LZ4', 'Gorilla, LZ4HC(1)',

        'ZSTD', 'ZSTD(1)', 'ZSTD(3)', 'ZSTD(6)', 'ZSTD(8)', 'ZSTD(12)',

        'Delta, LZ4', 'Delta, ZSTD(1)', 'Delta, ZSTD(3)', 'Delta, ZSTD(6)', 'Delta, LZ4HC(1)', 'Delta, LZ4HC(3)', 'Delta, LZ4HC(6)',

        'T64, LZ4', 'T64, ZSTD(1)', 'T64, ZSTD(3)', 'T64, ZSTD(6)', 'T64, LZ4HC(1)', 'T64, LZ4HC(3)', 'T64, LZ4HC(6)',

        'DoubleDelta', 'DoubleDelta, LZ4', 'DoubleDelta, ZSTD(1)', 'DoubleDelta, ZSTD(3)', 'DoubleDelta, ZSTD(6)', 'DoubleDelta, LZ4HC(1)', 'DoubleDelta, LZ4HC(3)'
    ];

    /*

    create table if not exists ${table_name} engine=MergeTree
            ORDER BY tuple()
            as select cast(now() + rand()%2000 + number, '${type}') as x from numbers(${rows});

     */


    const generators = ['linear', 'rand'];

    for (const gen of generators) {
        for (const codec of codecs) {
            await clickhouse.query(`DROP TABLE IF EXISTS ${table_name}`).toPromise();

            const create_table = `
            create table ${table_name} engine=MergeTree ORDER BY tuple()
            AS select cast(now() + rand()%2000 + number, 'DateTime') as x from numbers(1000000000);
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
        }
    }
}