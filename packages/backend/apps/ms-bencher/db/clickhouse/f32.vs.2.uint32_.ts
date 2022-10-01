import {clickhouse_localhost as clickhouse, clickhouse_localhost} from "../../../ms-base/src/db/clickhouse/clickhouse";
import assert from "assert";
import {prettyJSON} from "../../../ms-ti-base/output";
import {asyncWriteFile, getAppRootDir} from "../../../ms-base/src/utility-methods/file";
import boxplot from '@sgratzl/boxplots';


const exec = async () => {
    const table_name = 'quotation_2_int';
    const table_name_f32 = 'quotation_1_f32';

    await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name};`).toPromise();
    await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name_f32};`).toPromise();

    const create_table_2_int = `
        CREATE TABLE ${table_name} (
            n Int32,

            /* LZ4 compression */
            l_n64_doubledelta Int64 default n CODEC(DoubleDelta, LZ4HC(1)),
            l_n32_doubledelta Int32 default n Codec(DoubleDelta, LZ4)
 
     
        ) Engine = MergeTree
        PARTITION BY tuple() ORDER BY tuple();
    `;

    const create_table_f32 = `
        CREATE TABLE ${table_name_f32} (
            n Int32,

            /* LZ4 compression */
            z_f32_delta Float32 default n CODEC(Delta, ZSTD(1))
            
        ) Engine = MergeTree
        PARTITION BY tuple() ORDER BY tuple();
    `;

    let resp = await clickhouse_localhost.query(create_table_2_int).toPromise();
    assert(resp['r'] === 1, `not ok. table ${table_name} not created.`)
    let resp_f32 = await clickhouse_localhost.query(create_table_f32).toPromise();
    assert(resp_f32['r'] === 1, `not ok. table ${create_table_f32} not created.`)

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

    let jsonObject: any = {
        'res_sel_2ints': [],
        'res_sel_1_f32': [],
        'res_ins_2ints': [],
        'res_ins_1_f32': [],

        'bp_res_sel_2ints': {},
        'bp_res_sel_1_f32': {},
        'bp_res_ins_2ints': {},
        'bp_res_ins_1_f32': {},

    };



    let Epochjs = require('epochjs'),
        epochjs = new Epochjs(),
        epochjs2 = new Epochjs();

    const to = 100;
    const measure = 1;

    for (const num of range(1, to, 1)) {
        epochjs.start();

        const insert_q = // 100000000
            `insert into ${table_name} (n) select number from numbers(10000000) settings max_block_size=1000000;`

        resp = await clickhouse_localhost.query(insert_q).toPromise();
        assert(resp['r'] === 1, `not ok. insert to table ${table_name} failed.`)

        jsonObject['res_ins_2ints'].push(epochjs.secElapsed());

        epochjs2.start();

        await clickhouse.query(`SELECT (l_n64_doubledelta+l_n32_doubledelta)/10e9 as res FROM ${table_name}`).toPromise();

        jsonObject['res_sel_2ints'].push(epochjs2.secElapsed());

        await clickhouse_localhost.query(`TRUNCATE TABLE ${table_name}`).toPromise();
        //console.log(`column = ${c} with elapsed = ${elapsed}`)
    }

    for (const num of range(1, to, 1)) {
        epochjs.start();

        const insert_q = // 100000000
            `insert into ${table_name_f32} (n) select number from numbers(10000000) settings max_block_size=1000000;`

        resp = await clickhouse_localhost.query(insert_q).toPromise();
        assert(resp['r'] === 1, `not ok. insert to table ${table_name_f32} failed.`)

        jsonObject['res_ins_1_f32'].push(epochjs.secElapsed());

        epochjs2.start();

        await clickhouse.query(`SELECT z_f32_delta as res FROM ${table_name_f32}`).toPromise();

        jsonObject['res_sel_1_f32'].push(epochjs2.secElapsed());

        await clickhouse_localhost.query(`TRUNCATE TABLE ${table_name_f32}`).toPromise();
        //console.log(`column = ${c} with elapsed = ${elapsed}`)
    }

    jsonObject['bp_res_sel_2ints'] = boxplot(jsonObject['res_sel_2ints']);
    jsonObject['bp_res_sel_1_f32'] = boxplot(jsonObject['res_sel_1_f32']);
    jsonObject['bp_res_ins_2ints'] = boxplot(jsonObject['res_ins_2ints']);
    jsonObject['bp_res_ins_1_f32'] = boxplot(jsonObject['res_ins_1_f32']);

    //console.log(prettyJSON(jsonObject))

    await asyncWriteFile(`mean_f32_vs_(int64_plus_int32)_all_${to}_${measure}.log`, prettyJSON(jsonObject))

    await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name};`).toPromise();
    await clickhouse_localhost.query(`DROP TABLE IF EXISTS ${table_name_f32};`).toPromise();


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

