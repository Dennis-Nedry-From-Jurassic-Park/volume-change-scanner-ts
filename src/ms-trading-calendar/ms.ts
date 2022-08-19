import moment from "moment";
import assert from "assert";
import {TradingSchedule} from "tinkoff-invest-api/src/generated/instruments";
import {TinkoffInvestmentsDatabase} from "../db/clickhouse/dto/tinkoff.investments.database";
import {insert_into_table_multiple} from "../db/generate-schema/own-clickhouse-generator-scheme";
import {api} from "../ms-ti-base/api";
import {prettyJSON} from "../ms-ti-base/output";

const fill_tradings_day_table = async (exchanges: string[]) => {
    const from = moment('2022-08-01').toDate()
    const now = moment('2022-08-16').toDate();


    console.log(from)
    console.log(now)


    for (const exchange of exchanges) {
        const tradingSchedules = await api.instruments.tradingSchedules({
            exchange: exchange,
            from: from,
            to: now,
        });
        const tradingSchedulesR = tradingSchedules.exchanges.filter(t => t.exchange === exchange);

        assert(tradingSchedulesR.length > 0, 'list of exchanges should be not empty');

        console.log(prettyJSON(tradingSchedulesR))

        const merged = tradingSchedulesR[0].days.map( (obj:any) => {
            return {
                exchange: exchange,
                ...obj,
            }
        });

        console.log(prettyJSON(merged))

        //await prepare_insert_into_query(TinkoffInvestmentsDatabase.INSTRUMENTS, 'TradingSchedules', merged)
        await insert_into_table_multiple(TinkoffInvestmentsDatabase.INSTRUMENTS+'.TradingSchedules', merged)
    }
}


const prepare_insert_into_query = async (db: string, table: string, values: any[]) => {
    let query = 'INSERT INTO ' + db + '.' + table + ' (*) VALUES ('
    for (const value of values) {
        query += value + ',';
    }
    query = query.slice(0, -1) + ')';
    console.log(query)
}


function getPreviousWorkday(){
    let workday = moment('2022-08-13');
    let day = workday.day();
    let diff = 1;  // returns yesterday
    if (day == 0 || day == 6){  // is Sunday or Monday
        diff = day + 2;  // returns Friday
    }
    return workday.subtract(diff, 'days');
}





// function getPreviousWorkday(){
//     // Based on the current day, handle accordingly
//     switch(moment().day())
//     {
//         // If it is Monday (1),Saturday(6), or Sunday (0), Get the previous Friday (5)
//         // and ensure we are on the previous week
//         case 0:
//         case 1:
//         case 6:
//             return moment().subtract(6,'days').day(5);
//         // If it any other weekend, just return the previous day
//         default:
//             return moment().day(today - 1);
//     }
// }


getPreviousWorkday()


// , 'MOEX'
//fill_tradings_day_table(['SPB']);


/*
is_trading_day('MOEX');
is_trading_day('MOEX_MORNING');
is_trading_day('SPB');
*/