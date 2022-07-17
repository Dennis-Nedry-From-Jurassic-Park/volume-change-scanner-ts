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

} from '../../protos_ts/marketdata';



import {
	MarketDataServiceClient
} from '../../protos_ts/marketdata.client';

import moment from 'moment';

import {Timestamp} from '../../protos_ts/google/protobuf/timestamp';

import {grpcTransport} from '../auth/connection';
import { _stringify } from '../utils/json';
import { asyncWriteFile } from '../utility-methods/file';
import { Quotation } from '../../protos_ts/common';

const get_candles_for_stock = async (
    figi: string,
    from: Date,
    to: Date,
    candleInterval: CandleInterval
): Promise<any> => {
    const marketDataServiceClient = new MarketDataServiceClient(grpcTransport());
    const getCandlesRequest = GetCandlesRequest.create();
    getCandlesRequest.figi = figi;
    getCandlesRequest.from = Timestamp.fromDate(from);
    getCandlesRequest.to = Timestamp.fromDate(to);
    getCandlesRequest.interval = candleInterval;
    const candles = await marketDataServiceClient.getCandles(getCandlesRequest).response;
    console.log(_stringify(candles))
    //asyncWriteFile('../../temp_' + candleInterval.toString() + '.json', await _stringify(candles))
    return "";
}



// TODO: GetOrderBookRequest

get_candles_for_stock(
    'BBG002458LF8',
    moment('17.05.2022','DD-MM.YYYY').toDate(),
    moment('18.05.2022','DD-MM.YYYY').toDate(),
    CandleInterval.CANDLE_INTERVAL_HOUR
);


const get_last_candles_for_stocks = async (
    figi: string[]
): Promise<any> => {
    const marketDataServiceClient = new MarketDataServiceClient(grpcTransport());
    const getLastPricesRequest = GetLastPricesRequest.create();
    getLastPricesRequest.figi = figi;
    const candles = await marketDataServiceClient.getLastPrices(getLastPricesRequest).response;
    console.log(_stringify(candles))
    return "";
}

const get_orderbook = async (
    figi: string
): Promise<any> => {
    const marketDataServiceClient = new MarketDataServiceClient(grpcTransport());
    const getOrderBookRequest = GetOrderBookRequest.create();
    getOrderBookRequest.depth = 5;
    getOrderBookRequest.figi = figi;
    const orderbook = await marketDataServiceClient.getOrderBook(getOrderBookRequest).response;
    //console.log(_stringify(orderbook))
    console.log(orderbook)
    return "";
}

//get_last_candles_for_stocks(['BBG002458LF8', 'BBG000Q75BV1'])
//get_orderbook('BBG000BBQCY0')


const day = moment('14.02.2022','DD-MM.YYYY');
//const start = day.clone().startOf('day').add(+3,'hours').subtract(1, "days").toDate()//.add(+3,'hours')//.tz("Europe/Moscow");
//const end = day.clone().endOf('day').add(+4,'hours').toDate()//.add(+3,'hours');
const start = day.clone().startOf('day').add(+3,'hours').toDate()//.add(+3,'hours')//.tz("Europe/Moscow");
const end = moment().startOf('day').add(1, "days").add(+3,'hours').toDate()//.add(+3,'hours');

//console.log(start)
//console.log(end)

// TODO: 
// get_candles_for_stock(
//     'BBG004731032',
//     start,
//     end,
//     CandleInterval.CANDLE_INTERVAL_DAY // TODO: Day for week
// );

// amd_1mi_180522.json


const convertFromBigint = (quotation: Quotation | undefined): Number => {
    if(quotation !== undefined) {
        return Number(quotation.units) + Number(quotation.nano / 10E9) || 0;
    } else {
        return 0
    }
}

//const candles15mi: Candle[] = require('../../amd_15mi_180522 copy.json');
//const candles15mi: Candle[] = require('../../amd_15mi_19052022 copy.json');
const candles15mi: Candle[] = require('../../amd_hour_180522 copy 2.json');


//const singleObj: Candle = candles15mi.filter( (candle:Candle) => { return BigInt(candle.volume) === BigInt(1419) } )[0];
//const arrOpen: Quotation[] = candles15mi.filter( (candle:Candle) => { return candle.open } ) || [];


type MarketData = {
    open: Number[],
    high: Number[],
    low: Number[],
    close: Number[],
    volume: Number[],
}

type MDshare = {
    C_5_MI: MarketData,
    C_15_MI: MarketData,
    C_1H_MI: MarketData,
}



//const market_data: MarketData = { open: [], high: [], low: [], close: [], volume: [] };
import sizeof from 'object-sizeof';
import { Share } from '../../protos_ts/instruments';



const prepare_candles = (candles: Candle[]): MarketData => {
    const market_data: MarketData = { open: [], high: [], low: [], close: [], volume: [] };
    candles.forEach( (candle:Candle) => {
        market_data.open.push(convertFromBigint(candle.open) || 0) // Quotation.create()
        market_data.high.push(convertFromBigint(candle.high) || Quotation.create())
        market_data.low.push(convertFromBigint(candle.low) || Quotation.create())
        market_data.close.push(convertFromBigint(candle.close) || Quotation.create())
        market_data.volume.push(Number(candle.volume) || 0)
    });
    return market_data

}


type MinPriceShare = {
    minPrice: Number,
    maxPrice: Number,
    time: any
}


const prepare_candles2 = (candles: Candle[]): MinPriceShare => {
    
    let curr_max_high = convertFromBigint(candles[0].high || Quotation.create());
    let curr_min_low = convertFromBigint(candles[0].low || Quotation.create());
    let curr_time: any;
    candles.forEach( (candle:Candle) => {
        let curr_low = convertFromBigint(candle.low) || Quotation.create();
        let curr_high = convertFromBigint(candle.high) || Quotation.create();
        
        if(curr_max_high <= curr_high){
            curr_max_high = curr_high
        }

        if(curr_min_low >= curr_low){
            curr_min_low = curr_low
            curr_time = Timestamp.toDate(candle.time || Timestamp.create());
        }
        //console.log(Number(candle.volume) || 0)
        //console.log(convertFromBigint(candle.open) || 0) // Quotation.create()
        //console.log(convertFromBigint(candle.high) || Quotation.create())
        //console.log(curr_min_low)
        //console.log(convertFromBigint(candle.close) || Quotation.create())
        //console.log(curr_time)
        
    });
    const minPriceShare: MinPriceShare = { minPrice: 0, time: 0, maxPrice: 0 };
    minPriceShare.minPrice = curr_min_low;
    minPriceShare.time = curr_time;
    minPriceShare.maxPrice = curr_max_high;
    return minPriceShare
}

/*****
const lkoh: Candle[] = require('../../LKOH.json');
const md = prepare_candles2(lkoh);
console.log( md )


get_last_candles_for_stocks(['BBG004731032', 'BBG002B9T6Y1'])
 */


// console.log(100 * 3019.05 / 3942)
// console.log(100 * 65.67 / 69.11)
// console.log(1 - 3019.05 / 3942)
//console.log(100 * (1 - 65.67 / 69.11))
//console.log(100 * (69.11 / 65.67 - 1))


console.log(100 * (1 - 69.11 / 65.67))      // RedZone      -5.238312776001219
console.log(100 * (1 - 59.11 / 65.67))      // GreenZone    +9.989340642606981

// https://github.com/apexcharts/apexcharts.js
// https://github.com/zingchart/awesome-charting#free-and-open-source-libraries
// https://developers.google.com/chart/interactive/docs

// https://www.chartjs.org/docs/latest/samples/advanced/data-decimation.html
// https://www.chartjs.org/docs/latest/samples/bar/horizontal.html
// https://www.chartjs.org/docs/latest/samples/bar/vertical.html
// https://www.chartjs.org/docs/latest/samples/other-charts/bubble.html
// https://www.chartjs.org/docs/latest/samples/other-charts/scatter-multi-axis.html
// chartjs.org/docs/latest/samples/scriptable/bar.html
// https://www.chartjs.org/docs/latest/samples/area/radar.html
// 
/*


{"lastPrices":
[{
    "figi":"BBG004731032",
    "price":{"units":"3942","nano":0},
    "time":{"seconds":"1653407105","nanos":1462000}},
    {"figi":"BBG002B9T6Y1","price":{"units":"436","nano":0},"time":{"seconds":"1653406503","nanos":737778000}}]}

*/

type MinPriceShare0 = {
    minPrice: Number,
    maxPrice: Number,
    time: any
}


const get_min_max_by_hist_candles = (candles: Candle[]): MinPriceShare0 => {
    
    let curr_max_high = convertFromBigint(candles[0].high || Quotation.create());
    let curr_min_low = convertFromBigint(candles[0].low || Quotation.create());
    let curr_time: any;
    candles.forEach( (candle:Candle) => {
        let curr_low = convertFromBigint(candle.low) || Quotation.create();
        let curr_high = convertFromBigint(candle.high) || Quotation.create();
        
        if(curr_max_high <= curr_high){
            curr_max_high = curr_high
        }

        if(curr_min_low >= curr_low){
            curr_min_low = curr_low
            curr_time = Timestamp.toDate(candle.time || Timestamp.create());
        }
        //console.log(Number(candle.volume) || 0)
        //console.log(convertFromBigint(candle.open) || 0) // Quotation.create()
        //console.log(convertFromBigint(candle.high) || Quotation.create())
        //console.log(curr_min_low)
        //console.log(convertFromBigint(candle.close) || Quotation.create())
        //console.log(curr_time)
        
    });
    const minPriceShare: MinPriceShare = { minPrice: 0, time: 0, maxPrice: 0 };
    minPriceShare.minPrice = curr_min_low;
    minPriceShare.time = curr_time;
    minPriceShare.maxPrice = curr_max_high;
    return minPriceShare
}


type Struct = {
    sector: string,
    tickers: string[],
    figies: string[]
}

const sector_tickers_figies: Struct[] = require('../../all.json');

const marketDataServiceClient = new MarketDataServiceClient(grpcTransport());
const getLastPricesRequest = GetLastPricesRequest.create();

sector_tickers_figies.forEach( (struct:Struct) => {
    console.log("сектор: " + struct.sector);
    getLastPricesRequest.figi = struct.figies;
    const lastPrices = marketDataServiceClient
                    .getLastPrices(getLastPricesRequest).response;
    lastPrices.then(data => {
        data.lastPrices.forEach( (d) => {
            //const 
            //get_min_max_by_hist_candles()
            console.log(
                struct.tickers.shift()                                  // ticker
                + ';' 
                + convertFromBigint(d.price) || Quotation.create())    // currPrice
                + ';'
                + ''
        })
    })
    //console.log(_stringify(candles))
})



// const lastPrices: LastPrice[] = require('../../last_prices.json');

// console.log( lastPrices.map( (lastPrice:LastPrice) => { return lastPrice.figi } ))

// const shares: Share[] = require('../../convert.json');
// console.log(shares.map((share:Share) => { return { ticker: share.ticker } } ))


// let map = new Map<string, string>(); 

// shares.forEach( (s:Share) => {
//     map.set(s.figi, s.ticker);
// })
// console.log(map)
// console.log(map.get('BBG005YHY0Q7'))




//console.log(shares.map((share:Share) => { return { ticker: share.ticker  } } ))



// var bullish = require('technicalindicators').bullish;
// var bearish = require('technicalindicators').bearish;
// var AbandonedBaby = require( 'technicalindicators' ).abandonedbaby
// var VWAP = require('technicalindicators').VWAP;


// import ApexCharts from 'apexcharts'

// var options = {
//     chart: {
//       type: 'bar'
//     },
//     series: [
//       {
//         name: 'sales',
//         data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
//       }
//     ],
//     xaxis: {
//       categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
//     }
//   }
  
//   var chart = new ApexCharts(document.querySelector('#chart'), options)
//   chart.render()







//  const md = prepare_candles(candles15mi);
//  console.log( md )
//  console.log(sizeof(md)); // 1 md = 44.4 байта





// console.log( bullish(md) )
// console.log( bearish(md) )
// console.log( AbandonedBaby(md) )
// var vwap = new VWAP();
// vwap.calculate(md)
// console.log( vwap.getResult() )




// console.log( convertFromBigint(singleObj.open) )
// console.log( singleObj.open )
// console.log( singleObj.time )
// const date = Timestamp.create()
// console.log( Timestamp.toDate(singleObj.time || Timestamp.create()));





