import clickhouse from "../../ms-base/src/db/clickhouse/clickhouse";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {insert_into_table_multiple} from "../../ms-base/src/db/generate-schema/own-clickhouse-generator-scheme";
import assert from "assert";
import {delay} from "../../ms-ti-base/wait";
import {toNum} from "../../ms-ti-base/number";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {api} from "../../ms-ti-base/api";
import {bottleneck} from "../../ms-base/src/bottleneck/bottleneck";
import {logger_candles, logger_clickhouse} from "../../ms-base/src/logger/logger";
import Bottleneck from "bottleneck";
import {asyncWriteFile} from "../../ms-base/src/utility-methods/file";
import {prettyJSON} from "../../ms-ti-base/output";
import {is_trading_day, moment_business_days} from "../../ms-trading-calendar/ms-trading-calendar";
import {DAY} from "../../ms-base/src/constants/date.time.formats";
import {getHolidays, getLaborDay, isBankHoliday} from "date-fns-holiday-us";
import {Exchange} from "../../ms-base/src/constants/exchange";
import { isHoliday } from "nyse-holidays";



export const bottleneck_candles = new Bottleneck({
    minTime: 750,
    trackDoneStatus: true,
    retryCount: 3
});

// bottleneck_candles.on("failed", async (error, jobInfo) => {
//     const id = jobInfo.options.id;
//     console.warn(`Job ${id} failed: ${error}`);
//
//     if (jobInfo.retryCount === 0) { // Here we only retry once
//         console.log(`Retrying job ${id} in 250ms!`);
//         return 250;
//     }
// });

const insert_candles = async (
    tickers: string[],
    from: string,
    to: string,
    timeframe: CandleInterval
) => {
    let ins_rows: string[] = [];
    let failed_tickers: string[] = [];

    // for (const ticker of tickers) {
    //     await delay(250)
    //
    //     const share = await instrumentsService.get_share_by_ticker(ticker);
    //
    //     const candles = await bottleneck_candles.schedule(async () => {
    //         try {
    //             return await api.marketdata.getCandles({
    //                 figi: share.figi,
    //                 from: moment(from).toDate(),
    //                 to: moment(to).toDate(),
    //                 interval: timeframe
    //             });
    //         } catch (e:any) {
    //             console.log('failed to fetch candles for ticker ' + ticker + ' exception: ' + e.message)
    //         }
    //     });
    //
    //
    //     //await asyncWriteFile(`../../../${ticker}.json`, prettyJSON(candles!.candles))
    //
    //
    //     //await delay(250000000)
    //
    //
    //
    //     if(candles === undefined){
    //         failed_tickers.push(ticker)
    //         return;
    //     }
    //
    //     //assert(candles !== undefined, 'Empty candles for ticker ' + ticker)
    //
    //     const rows = candles.candles.map( ( row:any) => {
    //         let updated_row = row;
    //         updated_row.open = toNum(updated_row.open)
    //         updated_row.high = toNum(updated_row.high)
    //         updated_row.low = toNum(updated_row.low)
    //         updated_row.close = toNum(updated_row.close)
    //
    //         return {
    //             ticker: ticker,
    //             figi: share.figi,
    //             ...updated_row,
    //             tf: timeframe,
    //             //currency: share.currency,
    //             //exchange: share.exchange,
    //             //apiTradeAvailableFlag: share.apiTradeAvailableFlag
    //
    //         }
    //     });
    //
    //     for (const row of rows) { ins_rows.push(row); }
    // }



    for (const ticker of tickers) {
        if (ticker === 'J' || ticker === 'ELY') return;

        await delay(250)

        const share = await instrumentsService.get_share_by_ticker(ticker);

        await bottleneck.schedule(async () => {
            api.marketdata.getCandles({
                figi: share.figi,
                from: moment(from).toDate(),
                to: moment(to).toDate(),
                interval: timeframe
            })
                .then(it => {
                    if (it === undefined) {
                        failed_tickers.push(ticker)
                        console.log('failed to fetch candles for ticker ' + ticker + ';')
                        console.log('failed to fetch candles for tickers ' + tickers.join(' ') + ';')
                        logger_candles.error('failed to fetch candles for tickers ' + tickers.join(' ') + ';')
                    }

                    //assert(candles !== undefined, 'Empty candles for ticker ' + ticker)

                    const rows = it.candles.map( (row: any) => {
                        let updated_row = row;
                        updated_row.open = toNum(updated_row.open)
                        updated_row.high = toNum(updated_row.high)
                        updated_row.low = toNum(updated_row.low)
                        updated_row.close = toNum(updated_row.close)

                        return {
                            ticker: ticker,
                            figi: share.figi,
                            ...updated_row,
                            tf: timeframe,
                            //currency: share.currency,
                            //exchange: share.exchange,
                            //apiTradeAvailableFlag: share.apiTradeAvailableFlag

                        }
                    });

                    for (const row of rows) {
                        ins_rows.push(row);
                    }
                })
                .catch(err => {
                    console.log('failed to fetch candles for ticker ' + ticker + ' exception: ' + err.message)
                    logger_candles.error('failed to fetch candles for ticker ' + ticker + ' exception: ' + err.message)
                    failed_tickers.push(ticker)

                    console.log('failed to fetch candles for tickers ' + tickers.join(' ') + ';')
                    logger_candles.error('failed to fetch candles for tickers ' + tickers.join(' ') + ';')
                });
        });
    }

    const len = ins_rows.length;
    console.log('len = ' + len);
    console.log('len tickers = ' + tickers.length);
    console.log('len failed_tickers = ' + failed_tickers.length);
    console.log('failed_tickers = ' + failed_tickers);

    assert(len > 0, 'len must be greater than zero, length of rows for insert statement')

    const query = await insert_into_table_multiple('GetCandles', ins_rows)

    const queries: any[] = [query];

    await clickhouse.logQueries(queries)
}





export const prepare_candles = async (tickers: string[]) => {
    console.log('tickers.length='+tickers.length)
    assert(tickers.length > 0, 'tickers len must be greater than zero, length of rows for insert statement')
    let empty_tickers: string[] = [];

    const to = moment().format('YYYY-MM-DD')
    let prev = moment().subtract(1, 'day').subtract(0, 'hour')//.format('YYYY-MM-DD');
    let prev_day = moment(prev.format('YYYY-MM-DD')).toDate();

    if(isHoliday(prev_day)) {
        prev_day = moment_business_days(prev).prevBusinessDay();
    }
    //const prev_day = moment_business_days(prev).weekday()


    //console.log(prev)
        //console.log(isHoliday(moment(prev.format('YYYY-MM-DD')).toDate()))
    //console.log(isBankHoliday(moment(prev.format('YYYY-MM-DD')).toDate()))
    //console.log(getHolidays(2022))
    //console.log(getLaborDay(2022))



    //console.log(prev_day);
    //console.log(prev)
    //await delay(500000);




    // if(moment_business_days(prev, DAY).isHoliday()){
    //     prev_day = moment_business_days(prev, DAY).prevBusinessDay();
    // } else {
    //     prev_day = moment().subtract(1, 'days');
    // }

    //const prev_day_ = prev_day.format(DAY)

   // console.log('prev_day_='+prev_day_)


    await insert_candles(
        tickers,
        moment(prev_day).format(DAY),
        to,
        CandleInterval.CANDLE_INTERVAL_DAY
    )//.then(() => { console.log('insert_candles') });

    console.log('empty_tickers = ' + empty_tickers)
}

