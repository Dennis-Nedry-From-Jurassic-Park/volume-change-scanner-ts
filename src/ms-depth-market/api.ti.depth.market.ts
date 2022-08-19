import secrets from '../utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import {CandleInterval, SubscriptionInterval} from 'tinkoff-invest-api/cjs/generated/marketdata';
import moment from 'moment';
import {logger_market_depth} from "../logger/logger";
import {MARKET_DEPTH} from "../ms-ti-base/market.depth";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {toNum} from "../ms-ti-base/number";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

const get_market_depth = async (ticker:string) => {
    const depth_of_market = MARKET_DEPTH.D10;
    
    const share = await instrumentsService.get_share_by_ticker(ticker);

    const orderbooks = { 
      orderBook: [
        { figi: share.figi, depth: depth_of_market }
      ]
    }

    api.stream.market.on('data', data => {
        logger_market_depth.log('debug', "data: " + JSON.stringify(data));
        console.log(JSON.stringify(data));
    });

    api.stream.market.watch(orderbooks);

    //setTimeout(() => api.stream.market.cancel(), 1000);

    //await waitMarketStreamEvent(api, 'data');

    setTimeout(() => api.stream.market.unwatch(orderbooks), 5000);

    setTimeout(() => api.stream.market.cancel(), 30000);



    //api.stream.market.on('close', () => api.stream.market.watch({...});

    // api.stream.market.watch({ candles: [
    //     { figi: share.figi, interval: SubscriptionInterval.SUBSCRIPTION_INTERVAL_ONE_MINUTE }
    // ]});

    // https://github.com/vitalets/tinkoff-invest-api/blob/main/test/specs/stream.spec.ts
    //setTimeout(() => api.stream.market.unwatch({ orderBook: [ { figi: share.figi, depth: depth_of_market} ] }), 3000);
    //setTimeout(() => api.stream.market.cancel(), 1000);
}

// get_market_depth('NVDA')


const get_candles_historical = async (ticker:string) => {
  const share = await instrumentsService.get_share_by_ticker(ticker);

  const { candles } = await api.marketdata.getCandles({
    figi: share.figi,
    from: moment('01.07.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
    to: moment('01.08.2022', "DD/MM/YYYY").toDate(),
    interval: CandleInterval.CANDLE_INTERVAL_DAY
  })

  //candles.forEach( (c:HistoricCandle) => console.log("volume: " + c.volume))

  let newCandles = candles.map(object => {
      return {
        ...object,
        open: toNum(object.open),
        high: toNum(object.high),
        low: toNum(object.low),
        close: toNum(object.close),
      };
  });

  newCandles = newCandles.filter( (o:any) => {return o.volume > 10000})

  const high = newCandles.map( (nc:any) => { return nc.high });
  const close = newCandles.map( (nc:any) => { return nc.close });
  const low = newCandles.map( (nc:any) => { return nc.low });
  const volume = newCandles.map( (nc:any) => { return nc.volume });

  console.log(newCandles)
  console.log(newCandles.length)


  const ATR = require('technicalindicators').ATR

  const period = 14

  const input = {
      high : high,
      low  : low,
      close : close,
      period : period
  }
  
  
  console.log("atr: " + ATR.calculate(input));



  const newCandles2 = newCandles.filter( (nc:any) => { return nc.high, nc.close, nc.low})

  let array = newCandles2.map(obj => Object.values(obj));

  var stats = require("stats-analysis")


 const ta = require('ta.js');
  var data = array
  console.log(data.length)
  //[[3,2,1], [2,2,1], [4,3,1], [2,2,1]]; // [high, close, low]
  var length = data.length; // default = 14
  const atr2 = await ta.atr(data, length);
  console.log("atr2: " + atr2);


  //                        var outliers = require("outliers-lizia").outliersRemoving

/*

  console.log(volume)
  let v = volume
 // let new_vol = outliers(v, 1, 11202711, 1);
 // console.log(new_vol)
  console.log(stats.indexOfOutliers(volume))

  const ta = require('ta.js');
  var data = array
  console.log(data.length)
  //[[3,2,1], [2,2,1], [4,3,1], [2,2,1]]; // [high, close, low]
  var length = data.length; // default = 14
  const atr2 = await ta.atr(data, length);
  console.log("atr2: " + atr2);


  const vol_wo_holidays = volume.filter( (v:any) => { return v > 2000})
  console.log(vol_wo_holidays, 8007409)
  console.log(stats.indexOfOutliers(vol_wo_holidays))
  console.log(stats.filterOutliers(vol_wo_holidays, stats.outlierMethod.medianDiff))


  var outlier = require('outlier');

  //console.log(volume)
  //console.log(vol_wo_holidays)



                  // console.log(outlier(volume).findOutliers())
                  // console.log(outlier(vol_wo_holidays).findOutliers())
                  // console.log(outlier([12, 14, 8000000, 8100000, 9100000, 12, 10, 9, 16]).findOutliers())



  const { remove_outliers } = require('peirce-criterion');

const raw_data = volume;
const trimmed_data = remove_outliers(raw_data);
console.log(volume); // [1, 2, 3]
console.log(trimmed_data); // [1, 2, 3]

const { outliers } = require('outliers');

console.log(outliers(volume))
  //atr2
 // newCandles
  
 // const atrCandles: any[] = candles.map((obj, i) => ([ ...obj, open: atrCandles[i], high: atrCandles[i] }));

  //console.log(newCandles)

  // var data = [[3,2,1], [2,2,1], [4,3,1], [2,2,1]]; // [high, close, low]
  //const length = 14; // default = 14
  // ta.atr(data, length);

  // const period = 14;
  // const atr = ATR({ newCandles, period });
  // console.log(atr);


  //const newCandles: HistoricCandle[] = candles.map((obj, i) => ({ ...obj, open: newCandles[i], high: newCandles[i] }));

*/
  //console.log(candles)
}

const get_candles = async (ticker:string) => {
  const share = await instrumentsService.get_share_by_ticker(ticker);
  // обход листа акций с интервалом
  api.stream.market.watch({ candles: [
    { figi: share.figi, interval: SubscriptionInterval.SUBSCRIPTION_INTERVAL_ONE_MINUTE }
  ]});
  
  // обработка событий
  api.stream.market.on('data', data => console.log(data));
  api.stream.market.on('close', () => console.log('closed'));
  
  // закрыть соединение через 3 сек
  setTimeout(() => api.stream.market.cancel(), 5000);

  // api.stream.market.on('data', data => {
  //   logger.log('debug', "data: " + JSON.stringify(data));
  //   console.log(JSON.stringify(data));
  // });

  // const { candles } = await api.marketdata.getCandles({
  //   figi: share.figi,
  //   interval: CandleInterval.CANDLE_INTERVAL_5_MIN
  // });

}

get_candles_historical('NVDA');