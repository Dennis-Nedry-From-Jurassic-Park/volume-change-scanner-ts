import {CandleInterval, LastPrice} from "tinkoff-invest-api/cjs/generated/marketdata";
import {is_trading_day, moment_business_days} from "../../ms-trading-calendar/ms-trading-calendar";
import moment from "moment";
import {DAY} from "../../ms-base/src/constants/date.time.formats";
import clickhouse from "../../ms-base/src/db/clickhouse/clickhouse";
import {toNum} from "../../ms-ti-base/number";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {api} from "../../ms-ti-base/api";
import assert from "assert";

export const get_price_change = async (
    exchange: string,
    tickers: string[],
    interval: CandleInterval
) => {
    assert(is_trading_day(exchange), 'today should be trading day')
    assert(interval === CandleInterval.CANDLE_INTERVAL_DAY, 'CandleInterval should be day for unique tickers')

    const curr_day = moment();
    const prev_day = moment_business_days(curr_day).prevBusinessDay()
    const prev_day_ = moment(prev_day).format(DAY)

    let prep_tickers = '';

    for(let t of tickers) { prep_tickers += "'" + t + "',"; }

    prep_tickers = prep_tickers.slice(0, -1)

    let query = `
        SELECT
        ticker, figi, time, low, high, close, volume
        FROM GetCandles WHERE
        1=1
        AND tf=${interval}
        AND ticker IN (${prep_tickers})
        AND toDate(time)='${prev_day_}';
    `;

    query = query.replace(/(\r\n|\n|\r)/gm, "")

    const prev_day_prices_as_rows: any[] = await clickhouse.query(query).toPromise();

    let figies: any[] = [];
    for(let row of prev_day_prices_as_rows) {
        figies.push(row['figi'])
    }
    const lastPrices = await api.marketdata.getLastPrices({ figi: figies})

    let merged = lastPrices.lastPrices
        .map( (lastPrice: LastPrice) => {
            const share = instrumentsService.get_share_by_figi_(lastPrice.figi);
            const ticker = share.ticker
            const row: any = filter(prev_day_prices_as_rows, 'ticker', ticker)

            const prev_price = row.close
            const volume = row.volume
            const curr_price: any = toNum(lastPrice.price);
            return {
                ticker: ticker,
                time: lastPrice.time,
                prev_price: prev_price,
                curr_price: curr_price,
                volume: volume,
                change: (curr_price / prev_price - 1) * 100
            }
        });

    let table = make_array_objects_unique(merged).filter( (obj:any) => { return obj.change >= 2.5 || obj.change <= -2.5 })
        table.sort( (a:any,b:any) => b.change - a.change );
    console.table(table);
}

const make_array_objects_unique = (array: any[]): any[] => {
    return array.reduce((arr: any[], e) => {
        if (!arr.find((item:any) => {
            return item.ticker === e.ticker
                && item.volume === e.volume
                && item.prev_price === e.prev_price
                && item.curr_price === e.curr_price
        })) {
            arr.push(e);
        }
        return arr;
    }, [])
}

const filter = (rows: any[], column: string, value: any ): any => {
    return rows.filter((it:any) => it[column] === value)[0];
}