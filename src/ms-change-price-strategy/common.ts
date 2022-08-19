import {CandleInterval, LastPrice} from "tinkoff-invest-api/cjs/generated/marketdata";
import assert from "assert";
import {is_trading_day, moment_business_days} from "../ms-trading-calendar/ms-trading-calendar";
import moment from "moment";
import {DAY} from "../constants/date.time.formats";
import clickhouse from "../db/clickhouse/clickhouse";
import {api} from "../api.ti.common";
import {toNum} from "../ms-base/number";
import {instrumentsService} from "../ms-base/instruments.service";

export const get_price_change = async (
    exchange: string,
    tickers: string[],
    interval: CandleInterval
) => {
    assert(is_trading_day(exchange), 'today should be trading day')
    assert(interval === CandleInterval.CANDLE_INTERVAL_DAY, 'CandleInterval should be day for unique tickers')
    // candleInterval = дневки - по ним цену закрытия определяем
    const curr_day = moment(); //const prev_day = curr_day.subtract(1, 'days')
    const prev_day = moment_business_days(curr_day).prevBusinessDay()
    const prev_day_f = moment(prev_day).format(DAY)


    let prep_tickers = '';

    for(let t of tickers) {
        prep_tickers += "'" + t + "',";
    }

    prep_tickers = prep_tickers.slice(0, -1)

    let query = `
        SELECT ticker, figi, time,  low, high, close FROM GetCandles WHERE  
        1=1
        AND tf=${interval}
        AND ticker IN (${prep_tickers}) 
        AND toDate(time)='${prev_day_f}'
        AND isComplete=1
    `
    query = query.replace(/(\r\n|\n|\r)/gm, "") + ';'

    const prev_day_prices_as_rows: any[] = await clickhouse.query(query).toPromise();
    //for(let row of prev_day_prices_as_rows) { console.log(row['ticker']); console.log(row) }

    //await delay(30000)

    //let pairs: Pair[] = await instrumentsService._get_pairs_ticker_figi(tickers)
    //let figies = pairs.map(pair => { return pair.figi})

    let figies: any[] = [];
    for(let row of prev_day_prices_as_rows) {
        figies.push(row['figi'])
    }

    //console.log(figies)

    //await delay(60000)




    //TODO: let figies = await instrumentsService.get_figies_by_tickers_with_filter(
   // TODO:      tickers, [Exchange[exchange]], undefined, undefined, undefined
    //);

    const lastPrices = await api.marketdata.getLastPrices({ figi: figies})
    console.log(lastPrices)

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

            const prev_price = row.close || 1
            const curr_price: any = toNum(lastPrice.price);
            return {
                ticker: ticker,
                time: lastPrice.time,
                prev_price: prev_price,
                curr_price: curr_price,
                change: (curr_price / prev_price - 1) * 100
            }
        });

    //console.table(merged)
    let table = merged.filter( (obj:any) => { return obj.change >= 2.5 || obj.change <= -2.5 })
    table.sort( (a:any,b:any) => b.change - a.change )
    console.table(table)
    // tickers to getLastPrices = curr prices
}

const filter = (rows: any[], column: string, value: any ): any => {
    return rows.filter((it:any) => it[column] === value)[0];
}