import secrets from './utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import {CandleInterval, HistoricCandle, LastPrice} from 'tinkoff-invest-api/cjs/generated/marketdata';

import moment from 'moment';
import GoogleSpreadsheet from './google-spreadsheet/google.spreadsheet';
import Bottleneck from "bottleneck";
import {toNum} from "./ms-ti-base/number";
import { delay } from './ms-ti-base/wait';
import {ACCOUNT} from "./ms-ti-base/users.service";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

const { investing } = require('investing-com-api');

const limiter = new Bottleneck({
    minTime: 1000
});

const limiter_get_last_prices = new Bottleneck({
    minTime: 1500
});

type MinClosePriceShare = {
    minClosePrice: Number,
    time: any
}

type ShareStruct = {
    sector: string,
    tickers: string[],
    figies: string[],
    currencies: string[]
}

type MinPriceShare = {
    minPrice: Number,
    maxPrice: Number,
    time: any
}

const get_min_max_by_hist_candles = async (candles: HistoricCandle[]): Promise<MinPriceShare> => {
    let curr_max_high = toNum(candles[0]?.high)!;
    let curr_min_low = toNum(candles[0]?.low)!;
    let curr_time: any;

    const minPriceShare: MinPriceShare = { minPrice: 0, time: 0, maxPrice: 0 };

    if(candles.length === 0) { return minPriceShare}

    candles.forEach( (candle:HistoricCandle) => {
        let curr_low = toNum(candle.low)!;
        let curr_high = toNum(candle.high)!;
        
        if(curr_max_high <= curr_high){
            curr_max_high = curr_high
        }

        if(curr_min_low >= curr_low){
            curr_min_low = curr_low
            curr_time = candle.time;
        }
    });
    
    minPriceShare.minPrice = curr_min_low;
    minPriceShare.time = curr_time;
    minPriceShare.maxPrice = curr_max_high;
    return minPriceShare
}

const get_min_close_price_by_hist_candles = async (candles: HistoricCandle[]): Promise<MinClosePriceShare> => {
    let curr_min_low_close_price = toNum(candles[0]?.close)!;
    let curr_time: any;

    const minPriceShare: MinClosePriceShare = { minClosePrice: 0, time: 0 };

    if(candles.length === 0) { return minPriceShare}

    candles.forEach( (candle:HistoricCandle) => {
        let curr_low = toNum(candle.close)!;
        
        if(curr_min_low_close_price >= curr_low){
            curr_min_low_close_price = curr_low
            curr_time = candle.time;
        }
    });
    
    minPriceShare.minClosePrice = curr_min_low_close_price;
    minPriceShare.time = curr_time;
    minPriceShare.minClosePrice = curr_min_low_close_price;
    return minPriceShare
}

const toComma = (number?: any): string => { return (number || "").toString().replace('.', ',') }

//@Catch(SyntaxError, (err:any) => console.log(err))
const min_prices_24Feb = async (
    sector:string,
    figies: string[],
    tickers: string[],
    currencies: string[],
    gs: GoogleSpreadsheet
) => {
    //const limiter = new RateLimiter({ tokensPerInterval: 50, interval: 'second' });
    // const full_array = [
    //     'utilities', 
    //     'industrials'
    //     'telecom', 'materials', 'real_estate'
    //     'consumer', 'financial'
    //     'other', 'energy', 'it', 'health_care'
    // ]
    // const fetch_sectors = ['other', 'energy', 'it', 'health_care']
    // if(!fetch_sectors.includes(sector)) {
    //     return;
    // };

    /// 'utilities', 'industrials' 'telecom', 'materials', 'real_estate' 'consumer', 'financial' 'other', 'energy', 'it', 'health_care'
    //if(sector != 'utilities') return;

    await delay(500);
    
        const lastPrices = await limiter_get_last_prices.schedule(() => api.marketdata.getLastPrices({ figi: figies }));
         
    const cells: any[] = [];
    
    figies.forEach( async (figi:string) => {
        console.log("figi = " + figi)

        const ticker = tickers.shift();
        const currency = currencies.shift();

        const format = 'DD.MM.YYYY';
        const dateFrom = '18.02.2022';
        const dateTo = moment(new Date()).format(format);
        
        await delay(1000);

        //const candlesLoader = new CandlesLoader(api, { cacheDir: '.cache.ti.api.gs.ru.shares.report' });

        try {
            let {candles} = await api.marketdata.getCandles({
                figi: figi,
                from: moment(dateFrom, format).toDate(),
                to: moment(dateTo, format).toDate(),
                interval: CandleInterval.CANDLE_INTERVAL_DAY
                // ...api.helpers.fromTo('-5m'), // <- удобный хелпер для получения { from, to }
              });

              const minPrice = await get_min_max_by_hist_candles(candles)
              const minClosePrice = await get_min_close_price_by_hist_candles(candles)
              const obj = lastPrices.lastPrices.find( (lp: LastPrice) => { return lp.figi === figi});
              const currPrice = toNum(obj?.price);
              
              //console.log(sector + ';' + figi + ';' + ticker + ';' + currPrice + ';'  + minPrice.minPrice + ';' + currency + ';' + moment(minPrice.time).format('MM.DD.YYYY'))
              //console.log(figi + ';' + ticker + ';' + currPrice + ';'  + minPrice.minPrice + ';' + currency + ';' + moment(minPrice.time).format('MM.DD.YYYY'))
              
              const row =[
                  sector,figi,ticker,toComma(currPrice),toComma(minPrice.minPrice), toComma(minClosePrice.minClosePrice),currency
                  ,moment(minPrice.time).format('MM.DD.YYYY')//, `=100*(1-E/D${i_column})`
              ];
              cells.push(row)
        } catch(err:any) {
            console.log("Error: " + err)
            return;
        } 
    });

    await delay(2000);
    console.log(cells)
    await gs.appendAll("A3:H3", cells);
}


const exec = async () => {
    const gs = new GoogleSpreadsheet('RusStocks_now');
    await gs.clear("A3:J1000")

    const sector_tickers_figies : ShareStruct[] = require('../temp/all_fix.json');

    //const result = await limiter.schedule(() => myFunction(arg1, arg2));

    sector_tickers_figies.forEach( async (stf:ShareStruct) => {
        

        await delay(500);

        await limiter.schedule(() => min_prices_24Feb(stf.sector, stf.figies, stf.tickers, stf.currencies, gs))
        //setTimeout(min_prices_24Feb, 500, stf.sector, stf.figies, stf.tickers, stf.currencies, gs);

        // Promise.race([
        //     min_prices_24Feb(stf.sector, stf.figies, stf.tickers, stf.currencies, gs),
        //     new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
        // ]).catch(async function(err) {
        //     await scheduler.wait(5000);
        //     min_prices_24Feb(stf.sector, stf.figies, stf.tickers, stf.currencies, gs);
        // })

        //await scheduler.wait(10000);
    });

    //await update_IMOEX_index();
}


const update_IMOEX_index = async () => {
    const gs = new GoogleSpreadsheet('RusStocks_now');
    await gs.clear("N3:O3")
    await gs.clear("N4:O4")

    let response = await investing('indices/mcx', 'P1D', 'PT1M');
    response.sort((a:any, b:any) => b.date - a.date)

    const dt = moment(response[0].date).format('DD.MM.YYYY HH:mm');
    const imoex = response[0].value;
    
    console.log(dt + ' : ' +  imoex)
    await gs.appendAll("N3:N3", [[dt]])
    await gs.appendAll("N4:N4", [[imoex]])
   
    response = await investing('indices/mcx', 'P1Y', 'P1D');
    response.sort((a:any, b:any) => b.date - a.date)

    const dt_min = moment(response[0].date).format('DD.MM.YYYY HH:mm');
    const imoex_min = response[0].value;
    await gs.appendAll("O3:O3", [[dt_min]])
    await gs.appendAll("O4:O4", [[imoex_min]])
}

const update_IMOEX_index2 = async () => {
    let response = await investing('indices/mcx', 'P1Y', 'P1D');
    response.sort((a:any, b:any) => b.date - a.date)
    console.log(response[0])
}


const update_IMOEX_index3 = async () => {
    let response = await investing('indices/mcx', 'P1D', 'PT5M');
    response.sort((a:any, b:any) => a.date - b.date)

    const dt = moment(response[0].date).format('DD.MM.YYYY HH:mm');
    const imoex = response[0].value;
    response.sort((a:any, b:any) => b.date - a.date)
    const imoex2 = response[0].value;
    console.log(dt + ' : ' +  imoex + ' : ' +  imoex2)
}


const get_requests_limits = async () => {
    const tariff = await api.users.getUserTariff({})
    console.log(tariff.unaryLimits)

    
    const limitPerMinute_GetLastPrices = 100;
    const limitPerMinute_GetCandles = 100;

    const minute = 60;


    //tariff.unaryLimits.filter( (obj:any) => obj.methods)
}

//exec();
//update_IMOEX_index();
//get_requests_limits();

const main = async () => {
    console.log(ACCOUNT.IIS)
    console.log(ACCOUNT.BROKERAGE)
}
main();