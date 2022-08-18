import { Share } from "../../protos_ts/instruments";
import clickhouse from "../clickhouse/clickhouse"

const create_companies_table = `
    --DROP TABLE companies_temp_mem IF EXISTS;
    CREATE TABLE IF NOT EXISTS companies_temp_mem (
        dt DateTime DEFAULT now(),
        figi String,
        ticker String,
        classCode String,
        isin String,
        lot UInt32,
        currency String,
        shortEnabledFlag Bool,
        exchange LowCardinality(String),
        countryOfRisk LowCardinality(String),
        sector LowCardinality(String)
    )
    ENGINE = MergeTree()
    partition by tuple ()
    ORDER BY tuple()
    SETTINGS index_granularity = 8192
`;

/*
,
        nominal Nested
        (
            currency String,
            units Int64,
            nano Int32
        )
        */
 clickhouse.logQueries([create_companies_table]);



const insert_companies_data = async () => {
    let rows: any[] = [];
    const data: Share[] = require('../../RU_shares.json');
    data.forEach( (s:Share) => {
        rows.push({
            figi: s.figi,
            ticker: s.ticker,
            classCode: s.classCode,
            isin: s.isin,
            lot: s.lot,
            currency: s.currency,
            shortEnabledFlag: +!!s.shortEnabledFlag,
            //name: s.name,
            exchange: s.exchange,
            countryOfRisk: s.countryOfRisk,
            sector: s.sector
        
            //nominal: [s.nominal?.currency, s.nominal?.units, s.nominal?.nano]
        })
    });
    clickhouse.sessionId = 'fasfsafsa';
    await clickhouse.insert(
        'INSERT INTO companies_temp_mem (figi,ticker,classCode,isin,lot,currency,shortEnabledFlag,exchange,countryOfRisk,sector) ',
        rows
    ).toPromise();

    // clickhouse.sessionId = '111' ;
    // const ws = clickhouse.insert('INSERT INTO companies_temp_mem').stream();
    // for(let i = 0; i <= arr.length; i++) {
    //     await ws.writeRow(
    //         [
    //             e._.range(0, 50).map(
    //                 j => `${i}:${i * 2}:${j}`
    //             ).join('-')
    //         ]
    //     );
    // }

//wait stream finish
// const result = await ws.exec();

//     const insert_sql = clickhouse.performSql('', 'companies_temp_mem', arr);
//     clickhouse.logQueries([insert_sql]);
}

insert_companies_data();