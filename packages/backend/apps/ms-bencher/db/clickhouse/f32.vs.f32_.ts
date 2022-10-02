import {clickhouse_localhost as clickhouse, clickhouse_localhost} from "../../../ms-base/src/db/clickhouse/clickhouse";
import assert from "assert";
import {prettyJSON} from "../../../ms-ti-base/output";
import {asyncWriteFile, getAppRootDir} from "../../../ms-base/src/utility-methods/file";
import boxplot from '@sgratzl/boxplots';
import {v4 as uuid} from 'uuid';

const exec = async () => {
    let jsonObject: any = {};

    const table_name = 'table_name_f32';

    const to = 1;
    const measure = 1;

    const codecs = [
        // for linear data
        /********************** only codecs without compressions ****************/
        'DoubleDelta',
        'Gorilla',
        'LZ4',
        'ZSTD(3)',
        'ZSTD(1)',
        'Delta, ZSTD(1)',
        'Delta, ZSTD(3)',
        'DoubleDelta, ZSTD(1)',
        'DoubleDelta, ZSTD(3)',
        'DoubleDelta, LZ4HC(1)',
        'DoubleDelta, LZ4HC(3)',
        'DoubleDelta, LZ4',
        'Delta(4), LZ4',
    ]

    for (const codec of codecs) { // for first order
        jsonObject[`bp_res_sel_${codec}`] = {};
    }
    for (const codec of codecs) { // for first order
        jsonObject[`bp_res_ins_${codec}`] = {};
    }

    for (const codec of codecs) {
        jsonObject[`res_sel_${codec}`] = [];
    }
    for (const codec of codecs) {
        jsonObject[`res_ins_${codec}`] = [];
    }

    for (const codec of codecs) {
        await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name};`).toPromise();

        const create_table_f32 = `
            CREATE TABLE ${table_name} (
                n Int32,
    
                z_f32_delta Float32 default n CODEC(${codec})
    
            ) Engine = MergeTree
            PARTITION BY tuple() ORDER BY tuple();
        `;

        let resp = await clickhouse_localhost.query(create_table_f32).toPromise();
        assert(resp['r'] === 1, `not ok. table ${create_table_f32} not created.`)

        let Epochjs = require('epochjs'),
            epochjs1 = new Epochjs(),
            epochjs2 = new Epochjs();

        for (const num of range(1, to, 1)) {
            epochjs1.start();

            const insert_q =
                `insert into ${table_name} (n) select number from numbers(10000000) settings max_block_size=1000000;`

            resp = await clickhouse_localhost.query(insert_q).toPromise();
            assert(resp['r'] === 1, `not ok. insert to table ${table_name} failed.`)

            jsonObject[`res_ins_${codec}`].push(epochjs1.secElapsed());

            epochjs2.start();

            await clickhouse.query(`SELECT z_f32_delta as res FROM ${table_name}`).toPromise();

            jsonObject[`res_sel_${codec}`].push(epochjs2.secElapsed());

            jsonObject[`bp_res_sel_${codec}`] = boxplot(jsonObject[`res_sel_${codec}`]);

            await clickhouse_localhost.query(`TRUNCATE TABLE ${table_name}`).toPromise();
            // console.log(`column = ${c} with elapsed = ${elapsed}`)
        }
    }

    await asyncWriteFile(`F32_all_codecs_${to}_${measure}_${uuid()}.log`, prettyJSON(jsonObject));

    await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name};`).toPromise();
}

const range = (from, to, step): any[] =>
    Array.from({length: Math.floor((to - from) / step) + 1}, (v, i) => from + i * step)

exec();

