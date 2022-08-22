import {api} from "../ms-ti-base/api";
import {from} from "rxjs";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import moment, {DurationInputArg1, DurationInputArg2} from "moment";
import {CandleInterval, LastPrice} from "tinkoff-invest-api/cjs/generated/marketdata";
import Bottleneck from "bottleneck";
import {toNum} from "../ms-ti-base/number";
import {HistoricCandle} from "tinkoff-invest-api/cjs/generated/marketdata";
import {insert_into_table_multiple} from "../db/generate-schema/own-clickhouse-generator-scheme";
import clickhouse from "../db/clickhouse/clickhouse";
import {delay} from "../ms-ti-base/wait";
import assert from "assert";

const bottleneck = new Bottleneck({
    minTime: 1250
});

const get_days_between_start_end = async (
    amountDateTimeAgo: DurationInputArg1,
    momentJSunits: DurationInputArg2,
    tickers: string[],
) => {
    let count_inserted_len = 0

    const tf = CandleInterval.CANDLE_INTERVAL_1_MIN
    let day = moment().subtract(amountDateTimeAgo, momentJSunits).format('YYYY-MM-DD')
    let dates: any[] = [];
    let startDate = moment(day, 'YYYY-MM-DD');
    dates.push(startDate.format('YYYY-MM-DD'));
    while (!startDate.isSame(moment().format('YYYY-MM-DD'))) {
        startDate = startDate.add(1, 'days');
        dates.push(startDate.format('YYYY-MM-DD'));
    }

    console.log(dates);

    //const boole = moment().add(1, 'day')
    //assert(boole === moment(), '---------')

    const figies = await instrumentsService.get_figies_by_tickers(tickers);

    let finalCandles: any[] = []
    for (const figi of figies) {
        //let finalCandles: any[] = []
        for (const date of dates) {
            const start = moment(date).startOf('day')
            const end = moment(date).endOf('day')
            // console.log('\n');
            // console.log(start);
            // console.log(end);
            //const load_candles = async(tickers: string[]) => {

            const resp = await bottleneck.schedule(() => {
                return api.marketdata.getCandles({
                    figi: figi,
                    from: start.toDate(),
                    to: end.toDate(),
                    interval: tf
                })
            })

            //console.log(resp.candles)

            let merged = resp.candles
                .map((historicCandle: HistoricCandle) => {
                    const share = instrumentsService.get_share_by_figi_(figi);
                    const ticker = share.ticker
                    return {
                        ticker: ticker,
                        figi: figi,
                        open: toNum(historicCandle.open),
                        high: toNum(historicCandle.high),
                        low: toNum(historicCandle.low),
                        close: toNum(historicCandle.close),
                        volume: historicCandle.volume,
                        time: historicCandle.time,
                        isComplete: historicCandle.isComplete,
                        tf: tf
                    }
                });
            merged.forEach((it => finalCandles.push(it)));

            await delay(250)

            //console.log(resp.candles)
            //console.log('length = '+ resp.candles.length)

        }
        // let insert_query = await insert_into_table_multiple('GetCandles', finalCandles)
        //
        // await clickhouse.query(insert_query).toPromise();
        // //console.log('it = ' + it);
        // // 30318395 + 8803-5 = 30327198   30327193        31817581-1494337
        // 31817581+2052332=31829357
        //  33869913
        // (31824498)
        // count_inserted_len += finalCandles.length
        count_inserted_len += finalCandles.length
    }

    let insert_query = await insert_into_table_multiple('GetCandles', finalCandles)

    await clickhouse.query(insert_query).toPromise();
    //console.log('it = ' + it);
    // 30318395 + 8803-5 = 30327198   30327193        31817581-1494337


    console.log('total_inserted_len = ' + count_inserted_len)
    // 30318395
//}


    // let day1 = moment(moment(), 'YYYY-MM-DD')
    // let day2 = moment().subtract(amountDateTimeAgo, momentJSunits)
    // console.log('\n')
    // console.log('day1 = ' + day1)
    // console.log('day2 = ' + day2)
    //
    // let result = [moment({...day2})];
    //
    // while(day1.date() != day2.date()){
    //     day2.add(1, 'day');
    //     result.push(moment({ ...day2 }));
    // }
    //
    // const dates = result.map(x => x.format("YYYY-MM-DD"))
    //
    // console.log(dates[0]);
}
let tickers_10_00_main_session: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers_.json');
//get_days_between_start_end(2, 'weeks', tickers_10_00_main_session);
get_days_between_start_end(0, 'day', tickers_10_00_main_session);


// let now = moment();
// let monday = now.clone().weekday(1);
// let friday = now.clone().weekday(5);
// let isNowWeekday = now.isBetween(monday, friday, null, '[]');
//
// console.log(`now: ${now}`);
// console.log(`monday: ${monday}`);
// console.log(`friday: ${friday}`);
// console.log(`is now between monday and friday: ${isNowWeekday}`);


