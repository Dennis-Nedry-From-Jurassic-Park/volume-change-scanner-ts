import {
	MarketDataRequest,
	MarketDataResponse,
	SubscribeCandlesRequest,
	GetCandlesRequest,
	Candle,
	CandleInstrument,
	OrderBookInstrument,
	GetOrderBookRequest,
    CandleInterval,
    GetLastPricesRequest,
    LastPrice,
    HistoricCandle,

} from '../../protos_ts/marketdata';

// @ts-ignore
import { scheduler } from 'node:timers/promises';

import {
	MarketDataServiceClient
} from '../../protos_ts/marketdata.client';

import moment from 'moment';

import {Timestamp} from '../../protos_ts/google/protobuf/timestamp';

import {grpcTransport} from '../auth/connection';
import { _stringify } from '../utils/json';
import { asyncWriteFile } from '../utility-methods/file';
import { MoneyValue, Quotation } from '../../protos_ts/common';
import { Console } from 'console';
import GoogleSpreadsheet from '../google-spreadsheet/google.spreadsheet';


import {InstrumentsServiceClient} from '../../protos_ts/instruments.client';

import {
    InstrumentIdType,
    InstrumentRequest,
	InstrumentsRequest,
	InstrumentStatus
} from '../../protos_ts/instruments';

const get_candles_for_stock = async (
    figi: string,
    from: Date,
    to: Date,
    candleInterval: CandleInterval
): Promise<HistoricCandle[]> => {
    const marketDataServiceClient = new MarketDataServiceClient(grpcTransport());
    const getCandlesRequest = GetCandlesRequest.create();
    getCandlesRequest.figi = figi;
    getCandlesRequest.from = Timestamp.fromDate(from);
    getCandlesRequest.to = Timestamp.fromDate(to);
    getCandlesRequest.interval = candleInterval;
    const candles = (await marketDataServiceClient.getCandles(getCandlesRequest).response).candles;
    //console.log(_stringify(candles))
    //asyncWriteFile('../../temp_' + candleInterval.toString() + '.json', await _stringify(candles))
    return candles;
}

/*
{"volume":"6997","isComplete":true,"open":{"units":"49","nano":200000000},"high":{"units":"49","nano":600000000},"low":{"units":"49","nano":20000000},"close":{"units":"49","nano":300000000},"time":{"seconds":"1652770800","nanos":0}}

*/

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


type MinPriceShare = {
    minPrice: Number,
    maxPrice: Number,
    time: any
}
type MinClosePriceShare = {
    minClosePrice: Number,
    time: any
}

const convertFromBigint = (quotation: Quotation | undefined): Number => {
    if(quotation !== undefined) {
        return Number(quotation.units) + Number(quotation.nano / 1E9) || 0;
    } else {
        return 0
    }
}


const get_min_close_price_by_hist_candles = async (candles: HistoricCandle[]): Promise<MinClosePriceShare> => {
    
    let curr_min_low_close_price = convertFromBigint(candles[0]?.close || Quotation.create());
    let curr_time: any;

    const minPriceShare: MinClosePriceShare = { minClosePrice: 0, time: 0 };

    //console.log(candles)
    if(candles.length === 0) { return minPriceShare}

    candles.forEach( (candle:HistoricCandle) => {
        let curr_low = convertFromBigint(candle.close) || Quotation.create();
        
        if(curr_min_low_close_price >= curr_low){
            curr_min_low_close_price = curr_low
            curr_time = Timestamp.toDate(candle.time || Timestamp.create());
        }
        
    });
    
    minPriceShare.minClosePrice = curr_min_low_close_price;
    minPriceShare.time = curr_time;
    minPriceShare.minClosePrice = curr_min_low_close_price;
    return minPriceShare
}

const get_min_max_by_hist_candles = async (candles: HistoricCandle[]): Promise<MinPriceShare> => {
    
    let curr_max_high = convertFromBigint(candles[0]?.high || Quotation.create());
    let curr_min_low = convertFromBigint(candles[0]?.low || Quotation.create());
    let curr_time: any;

    const minPriceShare: MinPriceShare = { minPrice: 0, time: 0, maxPrice: 0 };

    //console.log(candles)
    if(candles.length === 0) { return minPriceShare}

    candles.forEach( (candle:HistoricCandle) => {
        let curr_low = convertFromBigint(candle.low) || Quotation.create();
        let curr_high = convertFromBigint(candle.high) || Quotation.create();
        
        if(curr_max_high <= curr_high){
            curr_max_high = curr_high
        }

        if(curr_min_low >= curr_low){
            curr_min_low = curr_low
            curr_time = Timestamp.toDate(candle.time || Timestamp.create());
        }
        
    });
    
    minPriceShare.minPrice = curr_min_low;
    minPriceShare.time = curr_time;
    minPriceShare.maxPrice = curr_max_high;
    return minPriceShare
}

const marketDataServiceClient = new MarketDataServiceClient(grpcTransport());
const getLastPricesRequest = GetLastPricesRequest.create();

const toComma = (number: any): string => {
    return number.toString().replace('.', ',')
}

const min_prices_24Feb = async (
    sector:string,
    figies: string[],
    tickers: string[],
    currencies: string[],
    gs: GoogleSpreadsheet
) => {
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
    if(sector != 'utilities') return;

    getLastPricesRequest.figi = figies;
    const lastPrices = await marketDataServiceClient
                    .getLastPrices(getLastPricesRequest).response;
                    
    const cells: any[] = [];
    
    figies.forEach( async (figi:string) => {
        const ticker = tickers.shift();
        const currency = currencies.shift();

        let candles: any;

        const dateFrom = '18.02.2022';
        const dateTo = '17.06.2022';
        const format = 'DD-MM.YYYY';

        setTimeout(() => {}, 250);

        candles = await get_candles_for_stock(
            figi, moment(dateFrom, format).toDate(), moment(dateTo, format).toDate(), CandleInterval.CANDLE_INTERVAL_DAY
        );

        const minPrice = await get_min_max_by_hist_candles(candles)
        const minClosePrice = await get_min_close_price_by_hist_candles(candles)
        const obj = lastPrices.lastPrices.find( (lp: LastPrice) => { return lp.figi === figi});
        const currPrice = convertFromBigint(obj?.price) || Quotation.create();
        
        //console.log(sector + ';' + figi + ';' + ticker + ';' + currPrice + ';'  + minPrice.minPrice + ';' + currency + ';' + moment(minPrice.time).format('MM.DD.YYYY'))
        //console.log(figi + ';' + ticker + ';' + currPrice + ';'  + minPrice.minPrice + ';' + currency + ';' + moment(minPrice.time).format('MM.DD.YYYY'))
        
        const row =[
            // TODO : RSTIP
            sector,figi,ticker,toComma(currPrice),toComma(minPrice.minPrice), toComma(minClosePrice.minClosePrice),currency,moment(minPrice.time).format('MM.DD.YYYY')
        ];
        cells.push(row)
    });
    await delay(3000);
    await gs.appendAll("A3:G3", cells);
}

type Struct = {
    sector: string,
    tickers: string[],
    figies: string[],
    currencies: string[]
}

const exec = async () => {
    const gs = new GoogleSpreadsheet('RusStocks_now');
    //await gs.clear("A3:H1000")

    const sector_tickers_figies : Struct[] 
                                = require('../../temp/all_fix.json');
    sector_tickers_figies.forEach( async (stf:Struct) => {
        setTimeout(min_prices_24Feb, 2500, stf.sector, stf.figies, stf.tickers, stf.currencies, gs);

        // Promise.race([
        //     min_prices_24Feb(stf.sector, stf.figies, stf.tickers, stf.currencies, gs),
        //     new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
        // ]).catch(async function(err) {
        //     await scheduler.wait(5000);
        //     min_prices_24Feb(stf.sector, stf.figies, stf.tickers, stf.currencies, gs);
        // })

        //await scheduler.wait(10000);
    });
}
//exec();

const rts = async () => {
    const instrumentsServiceClient = new InstrumentsServiceClient(grpcTransport());
    let instrumentRequest = InstrumentsRequest.create();
    instrumentRequest.instrumentStatus = InstrumentStatus.BASE
    let shareInfo = await instrumentsServiceClient.futures(instrumentRequest) 
    console.log(shareInfo.response)
    asyncWriteFile('../../temp_' + 'features' + '.json', await _stringify(shareInfo.response))
}

const get_rts_price = async () => {
    getLastPricesRequest.figi = ['FUTRTS032200', 'FUTMIX092200'];
    const lastPrices = await marketDataServiceClient
                    .getLastPrices(getLastPricesRequest).response;

                    lastPrices.lastPrices.forEach( p => {
                        console.log(p.figi + ' = ' + Number(p.price?.units) + Number(p.price!.nano / 1E9 || 0))
                    })                
    //console.log(lastPrices)
}
get_rts_price();

/*
Фьючерс на индекс ртс
"figi": "FUTRTS032200",
"ticker": "RIH2",
"classCode": "SPBFUT",


Фьючерс на индекс мосбиржи
"figi": "FUTMIX092200",
"ticker": "MXU2",
"classCode": "SPBFUT",
*/

//rts();

const convertFromBigint0 = (quotation: Quotation | undefined): Number => {
    const exponent = quotation?.nano.toString().length
    //const exponent = nano?.toString().length
    
    if(quotation !== undefined) {
        //return Number(quotation.units) + Number(quotation.nano / Math.pow(10, exponent || 1)) || 0;
        //return (Number(quotation.units) + Number(quotation.nano / Math.pow(10, exponent || 1))) || 0;
        return (Number(quotation.units) + Number(quotation.nano / 1e9)) || 0;
    } else {
        return 0
    }
}

const check_RSTIP = async() => {
    const marketDataServiceClient = new MarketDataServiceClient(grpcTransport());
    const getLastPricesRequest = GetLastPricesRequest.create();
    getLastPricesRequest.figi = ['BBG000KTF667']
    let lastPrices = await marketDataServiceClient.getLastPrices(getLastPricesRequest).response;
    
    const instrumentsServiceClient = new InstrumentsServiceClient(grpcTransport());
    let instrumentRequest = InstrumentRequest.create();
    instrumentRequest.classCode = 'TQBR'
    instrumentRequest.id = 'BBG000KTF667'
    instrumentRequest.idType = InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI
    let shareInfo = await instrumentsServiceClient.shareBy(instrumentRequest).response
    console.log(shareInfo.instrument)
    //const num = 50.25;
    //console.log(num.toString().replace('.', ','))

    const p = convertFromBigint(lastPrices.lastPrices[0].price)
    console.log(p)

    getLastPricesRequest.figi = ['BBG004730RP0']
    lastPrices = await marketDataServiceClient.getLastPrices(getLastPricesRequest).response;
    const p2 = convertFromBigint(lastPrices.lastPrices[0].price)
    console.log(p2)

    getLastPricesRequest.figi = ['BBG000R466J1']
    lastPrices = await marketDataServiceClient.getLastPrices(getLastPricesRequest).response;
    const p3 = convertFromBigint(lastPrices.lastPrices[0].price)
    console.log(p3)

    instrumentRequest.classCode = 'TQBR'
    instrumentRequest.id = 'BBG000R466J1'
    instrumentRequest.idType = InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI
    shareInfo = await instrumentsServiceClient.shareBy(instrumentRequest).response
    //console.log(shareInfo.instrument?.minPriceIncrement)
    
    getLastPricesRequest.figi = ['BBG000Q7GJ60']
    lastPrices = await marketDataServiceClient.getLastPrices(getLastPricesRequest).response;
    const p4 = convertFromBigint(lastPrices.lastPrices[0].price)
    console.log(p4)

    instrumentRequest.classCode = 'TQBR'
    instrumentRequest.id = 'BBG000Q7GJ60'
    instrumentRequest.idType = InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI
    shareInfo = await instrumentsServiceClient.shareBy(instrumentRequest).response
    //console.log(shareInfo.instrument)
}
//check_RSTIP();


const check_dot = async() => {
    const num = 50.25;
    console.log(num.toString().replace('.', ','))
}

const check_gs = async() => {
    const gs = new GoogleSpreadsheet('RusStocks');
    gs.appendAll("J7:K7", [["1","2"],["3","4"]])
}
const check_clear = async() => {
    const gs = new GoogleSpreadsheet('RusStocks');
    gs.clear("A3:G279")
}

const check_c = async() => {
    let candles: any;

    const dateFrom = '24.02.2022';
    const dateTo = '25.02.2022';
    const format = 'DD-MM.YYYY';
    const figi = 'BBG00475KKY8';

    setTimeout(() => {}, 250);

    candles = await get_candles_for_stock(
        figi, moment(dateFrom, format).toDate(), moment(dateTo, format).toDate(), CandleInterval.CANDLE_INTERVAL_DAY
    );

    console.log(_stringify(candles))
}

//check_c();

const check_array_inc = async() => {
    const arr = ['tom', 'jerry', 'any']
    const elem = 'jerry1'

    // if(arr.includes(elem)){
    //     console.log("contains ")
    // }

    const SECTOR = 'it'
    const fetch_sectors = ['energy', 'it', 'health_care']
    if(!fetch_sectors.includes(SECTOR)) {
        console.log("contains 11");
    } else {
        console.log("contains " + SECTOR);
    }
}

//check_array_inc();
//min_prices_24Feb();




// BBG00F6NKQX3;2225.05;1900;Mon Mar 28 2022 10:00:00 GMT+0300 (Москва, стандартное время)
// BBG000RJXRQ4;1327;969;Thu Feb 24 2022 10:00:00 GMT+0300 (Москва, стандартное время)

// const candles = get_candles_for_stock(
//     "BBG000Q75BV1", // SELG
//     moment('18.02.2022','DD-MM.YYYY').toDate(),
//     moment('02.06.2022','DD-MM.YYYY').toDate(),
//     CandleInterval.CANDLE_INTERVAL_DAY
// );
// console.log(_stringify(candles))


