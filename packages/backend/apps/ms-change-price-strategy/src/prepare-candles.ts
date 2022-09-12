import clickhouse from "../../ms-base/src/db/clickhouse/clickhouse";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import {insert_into_table_multiple} from "../../ms-base/src/db/generate-schema/own-clickhouse-generator-scheme";
import assert from "assert";
import {delay} from "../../ms-ti-base/wait";
import {toNum} from "../../ms-ti-base/number";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {api} from "../../ms-ti-base/api";
import {bottleneck} from "../../ms-base/src/bottleneck/bottleneck";
import {logger_candles} from "../../ms-base/src/logger/logger";
import Bottleneck from "bottleneck";
import {getPreviousWorkday} from "../../ms-trading-calendar/ms-trading-calendar";
import {DAY} from "../../ms-base/src/constants/date.time.formats";
import {isHoliday} from "nyse-holidays";
import moment from "moment";

import * as mb from "moment-business";

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
    let prev = moment().subtract(1, 'day')//.format('YYYY-MM-DD');
    let prev_day: Date = moment(prev.format('YYYY-MM-DD')).toDate();

    if(isHoliday(prev_day)) {
        prev_day = mb(prev).prevBusinessDay();
    } else if(mb.isWeekendDay(prev)) {
        prev_day = getPreviousWorkday(prev);
    }

    await insert_candles(
        tickers,
        moment(prev_day).format(DAY),
        to,
        CandleInterval.CANDLE_INTERVAL_DAY
    );

    console.log('empty_tickers = ' + empty_tickers)
}

