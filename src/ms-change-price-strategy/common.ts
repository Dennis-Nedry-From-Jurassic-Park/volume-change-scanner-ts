import {CandleInterval, LastPrice} from "tinkoff-invest-api/cjs/generated/marketdata";
import {is_trading_day, moment_business_days} from "../ms-trading-calendar/ms-trading-calendar";
import moment from "moment";
import {DAY} from "../constants/date.time.formats";
import clickhouse from "../db/clickhouse/clickhouse";
import {toNum} from "../ms-ti-base/number";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {api} from "../ms-ti-base/api";
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

    for(let t of tickers) {
        prep_tickers += "'" + t + "',";
    }

    prep_tickers = prep_tickers.slice(0, -1)

    let query = `
        SELECT ticker, figi, time, low, high, close, volume FROM GetCandles WHERE  
        1=1
        AND tf=${interval}
        AND ticker IN (${prep_tickers}) 
        AND toDate(time)='${prev_day_}'
    `
    query = query.replace(/(\r\n|\n|\r)/gm, "") + ';'

    const prev_day_prices_as_rows: any[] = await clickhouse.query(query).toPromise();

    //await delay(30000)

    //let pairs: Pair[] = await instrumentsService._get_pairs_ticker_figi(tickers)
    //let figies = pairs.map(pair => { return pair.figi})

    let figies: any[] = [];
    for(let row of prev_day_prices_as_rows) {
        figies.push(row['figi'])
    }

    //console.log(figies)

    //await delay(60000)


    const lastPrices = await api.marketdata.getLastPrices({ figi: figies})
        //console.log(lastPrices)

        //assert(Exchange[exchange] === Exchange.SPB, '!Exchange.SPB')



    //const filtered = lastPrices.lastPrices.filter(it => it.price !== undefined)


    //const ps: string[] = pairs.map(pair => { return pair.ticker })

    //const prev_day_prices_as_rows_merged = []


    // prev_day_prices_as_rows.forEach(it => {
    //     if()
    //     prev_day_prices_as_rows_merged.push(prev_day_prices_as_rows.)
    // })


    // for(let ticker of ps){
    //     for(let row of prev_day_prices_as_rows) {
    //         if(row[])
    //     }
    // }
    //
    //
    //
    // = prev_day_prices_as_rows.filter(it => it['ticker'] === pairs[it['ticker']]);

    //console.log(filtered)
    //console.log(lastPrices.lastPrices)
    console.log(prev_day_prices_as_rows.length)
    console.log(lastPrices.lastPrices.length)
   // console.log(pairs.length)
    //console.log(filtered.length)
    console.log(prev_day_prices_as_rows.length)

    //assert(prev_day_prices_as_rows.length === pairs.length)
    //assert(lastPrices.lastPrices.length === pairs.length)
    //assert(lastPrices.lastPrices.length === filtered.length)
    //assert(pairs.length === filtered.length)

    let merged = lastPrices.lastPrices
        .map( (lastPrice: LastPrice) => {
            // let ticker = prev_day_prices_as_rows.filter((row:any) => {
            //     console.log('row='+row.ticker)
            //     console.log('lastPrice='+prettyJSON(lastPrice))
            //     //console.log('figi='+row['figi'])
            //     //console.log('lastPrice.figi='+lastPrice.figi)
            //     return row.figi === lastPrice.figi
            // })[0]  // ['ticker'];

            //console.log('ticker='+ticker)

            // try {
            //     ticker = pairs.filter(i => {
            //         return i.figi === lastPrice.figi
            //     })[0].ticker;
            // } catch (error) {
            //     console.log(error)
            //     console.log('figi=' + lastPrice.figi)
            //     const share = await instrumentsService.get_share_by_figi(lastPrice.figi)
            //     console.log('ticket=' + share.ticker)
            //     return;
            // }
            const share = instrumentsService.get_share_by_figi_(lastPrice.figi);
            const ticker = share.ticker
            const row: any = filter(prev_day_prices_as_rows, 'ticker', ticker)

            // if (row === undefined || row.close === undefined) {
            //     return
            // }

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

    //let unique = require('make-unique')

    //console.log(merged.length)

    // let u_merged = unique([
    //     merged
    // ], (a:any, b:any) => {
    //     // if `a` and `b` contain the same `.a`, they are the 'same'
    //     return a.ticker === b.ticker
    //         && a.time === b.time
    //         && a.prev_price === b.prev_price
    //         && a.curr_price === b.curr_price
    //         && a.volume === b.volume
    //         && a.volume === b.volume
    //         && a.change === b.change
    // })


    // const dedup = [...new Set(merged.map(m => `${m.ticker}:${m.ticker}`))].map(m => {
    //     const [x,y] = m.split(':').map((n:any) => n | 0);
    //     return {x,y};
    // });
    let u_merged = merged.reduce((arr: any[], e) => {
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

    console.log(
        u_merged
    );

    //console.table(merged)
    //console.log(u_merged.length)

    let table = u_merged.filter( (obj:any) => { return obj.change >= 2.5 || obj.change <= -2.5 })
    table.sort( (a:any,b:any) => b.change - a.change )
    console.table(table)
    // console.log(unique([
    //     {a: 1, price: 50.555},
    //     {a: 2, price: 50.555},
    //     {a: 1, price: 50.555}
    //
    // ], (a, b) => {
    //     // if `a` and `b` contain the same `.a`, they are the 'same'
    //     return a.a === b.a && a.price === b.price
    // }))
}

const filter = (rows: any[], column: string, value: any ): any => {
    return rows.filter((it:any) => it[column] === value)[0];
}