import clickhouse from "../db/clickhouse/clickhouse";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {insert_into_table_multiple} from "../db/generate-schema/own-clickhouse-generator-scheme";
import assert from "assert";
import {delay} from "../ms-ti-base/wait";
import {toNum} from "../ms-ti-base/number";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {api} from "../ms-ti-base/api";
import {bottleneck} from "../bottleneck/bottleneck";
import {logger_candles, logger_clickhouse} from "../logger/logger";

const insert_candles = async (
    tickers: string[],
    from: string,
    to: string,
    timeframe: CandleInterval
) => {
    let ins_rows: any[] = [];

    for (const ticker of tickers) {
        await delay(250)

        const share = await instrumentsService.get_share_by_ticker(ticker);

        const candles = await bottleneck.schedule(async () => {
            try {
                return api.marketdata.getCandles({
                    figi: share.figi,
                    from: moment(from).toDate(),
                    to: moment(to).toDate(),
                    interval: timeframe
                });
            } catch (e:any) {
                console.log('failed to fetch candles for ticker ' + ticker + ' exception: ' + e.message)
                logger_candles.error('failed to fetch candles for ticker ' + ticker + ' exception: ' + e.message)
            }
        });

        assert(candles !== undefined, 'Empty candles for ticker ' + ticker)

        const rows = candles.candles.map( ( row:any) => {
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

        for (const row of rows) { ins_rows.push(row); }
    }

    const query = await insert_into_table_multiple('GetCandles', ins_rows)

    const len = ins_rows.length;
    console.log('len = ' + len);

    assert(len > 0, 'len must be grater than zero, length of rows for insert statement')

    const queries:any[] = [query];

    await clickhouse.logQueries(queries)
}

export const prepare_candles = async (tickers: string[]) => {
    let empty_tickers: string[] = [];

    const to = moment().format('YYYY-MM-DD')
    const prev = moment().subtract(1, 'days').format('YYYY-MM-DD')
    await insert_candles(
        tickers,
        prev,
        to,
        CandleInterval.CANDLE_INTERVAL_DAY
    );

    console.log('empty_tickers = ' + empty_tickers)
}

