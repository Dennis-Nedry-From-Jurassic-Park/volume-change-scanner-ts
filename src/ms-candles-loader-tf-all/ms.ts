import clickhouse from "../db/clickhouse/clickhouse"
import {v4} from "uuid";
import moment from "moment";
import assert from "assert";
import {ACCOUNT} from "../ms-base/users.service";

const insert_into_table = async () => {
//     const queries = [`
//         INSERT INTO shares (*) VALUES
// (
// 'BBG004S687W8','MSNG','TQBR','RU0008958863',1000,'rub',false,'Мосэнерго','MOEX',39749359700,'RU','Российская Федерация','utilities',28267726000,4,false,true,true,true,1,true,'',1,[2,0],[2,0],[0,300000000],[0,300000000],[0,1633000
// 00],[0,140200000],[735868800,0],['rub',1,0],[0,500000]
// )
//
//
//     `];
   // const queries = [`INSERT INTO shares (*) VALUES ('BBG004S687W8','MSNG','TQBR','RU0008958863',1000,'rub',0,'Мосэнерго','MOEX',39749359700,'RU','Российская Федерация','utilities',28267726000,4,0,1,1,1,1,1,'',1,[2],[0],[2],[0],[0],[300000000],[0],[300000000],[0],[163300000],[0],[140200000],[735868800],[0],['rub'],[1],[0],[0],[500000])`];
    const queries = [`INSERT INTO shares (*) VALUES ('BBG004S687W8','MSNG','TQBR','RU0008958863',1000,'rub',0,'Мосэнерго','MOEX',39749359700,'RU','Российская Федерация','utilities',28267726000,4,0,1,1,1,1,1,'',1,[2],[0],[2],[0],[0],[300000000],[0],[300000000],[0],[163300000],[0],[140200000],[735868800],[0],['rub'],[1],[0],[0],[500000]),('BBG004S687W8','MSNG','TQBR','RU0008958863',1000,'rub',0,'Мосэнерго','MOEX',39749359700,'RU','Российская Федерация','utilities',28267726000,4,0,1,1,1,1,1,'',1,[2],[0],[2],[0],[0],[300000000],[0],[300000000],[0],[163300000],[0],[140200000],[735868800],[0],['rub'],[1],[0],[0],[500000])`];
//     const queries0 = [`
// INSERT INTO shares (*) VALUES ('BBG004S687W8','MSNG','TQBR','RU0008958863',1000,'rub',0,'Мосэнерго','MOEX',39749359700,'RU','Российская Федерация','utilities',28267726000,4,0,1,1,1,1,1,'',1,[2,0],[2,0],[0,300000000],[0,300000000],[0,163300000],[0,140200000],[735868800,0],['rub',1,0],[0,500000])
//
//     `];


    const queries0 = [`INSERT INTO shares0 (*) VALUES ('MSNG', [735868801],[2])`]

    await clickhouse.logQueries(queries)
}



const create_table = async () => {
    const queries = [`
    CREATE TABLE IF NOT EXISTS shares 
(
\tfigi String,
\tticker String,
\tclassCode String,
\tisin String,
\tlot UInt32,
\tcurrency String,
\tshortEnabledFlag Bool,
\tname String,
\texchange String,
\tissueSize UInt32,
\tcountryOfRisk String,
\tcountryOfRiskName String,
\tsector String,
\tissueSizePlan UInt32,
\ttradingStatus UInt32,
\totcFlag Bool,
\tbuyAvailableFlag Bool,
\tsellAvailableFlag Bool,
\tdivYieldFlag Bool,
\tshareType UInt32,
\tapiTradeAvailableFlag Bool,
\tuid String,
\trealExchange UInt32,
\tklong Nested(units UInt32,nano UInt32),
\tkshort Nested(units UInt32,nano UInt32),
\tdlong Nested(units UInt32,nano UInt32),
\tdshort Nested(units UInt32,nano UInt32),
\tdlongMin Nested(units UInt32,nano UInt32),
\tdshortMin Nested(units UInt32,nano UInt32),
\tipoDate Nested(seconds UInt32,nanos UInt32),
\tnominal Nested(currency String,units UInt32,nano UInt32),
\tminPriceIncrement Nested(units UInt32,nano UInt32)
) ENGINE = MergeTree() ORDER BY tuple();
    `];

    await clickhouse.logQueries(queries)
}

const exec = async () => {
    const queries:any[] = [
        "SELECT version();"
    ];
    await clickhouse.logQueries(queries)

    //clickhouse.sessionId = v4();
    const accountId: number = ACCOUNT.IIS as number;
    const countDeals: number = 0;
    const day = moment().format("YYYY-MM-DD");
    const day0 = moment().format("YYYY-MM-DD hh:mm:ss");

    const table = 'atr.risk_per_deal_per_day';

    const rows: any = await clickhouse.query(
        `SELECT count (*) as num_rows FROM ${table} where toDate(timestamp) = ` + `(SELECT toDate(parseDateTimeBestEffort('${day}')));`
    ).toPromise();


    console.log('num_rows = ' + rows[0]['num_rows'])
    assert(rows[0]['num_rows'] === 0, 'найден дубликат количества сделок за текущий день')

    //clickhouse.sessionId = v4();

    const rows0 = [
        {
            timestamp: day0,
            accountId: accountId,
            countDeals: countDeals,
        }
    ]


    const insertQuery = `INSERT INTO ${table} (timestamp, accountId, countDeals) `
    await clickhouse.insert(insertQuery, rows0).toPromise()


    await clickhouse.logQueries([`select * from ${table}`])

}
//create_table();
insert_into_table();