import secrets from './utility-methods/env';

import { RealAccount, TinkoffAccount, TinkoffInvestApi } from 'tinkoff-invest-api';
import { Candle, CandleInterval, HistoricCandle, SubscriptionInterval } from 'tinkoff-invest-api/cjs/generated/marketdata';
import moment from 'moment';

//import * as d3 from "d3";


//import { timeParse } from "d3-time-format";

const token = secrets.token!;

import { ATR } from '@aduryagin/technical-indicators'
import {instrumentsService} from "./ms-base/instruments.service";
import { toNum } from './ms-base/number';

const api = new TinkoffInvestApi({ token: token });


export const checker = async () => {
    const arr: any = [
        {
          open: 149.65,
          high: 150.64,
          low: 143.9,
          close: 144.78,
          volume: 10988164,
          time: '2022-07-01T04:00:00.000Z',
          isComplete: true
        },
        {
          open: 143.06,
          high: 150,
          low: 140.55,
          close: 149.54,
          volume: 11436737,
          time: '2022-07-05T04:00:00.000Z',
          isComplete: true
        }
    ]

    let newCandles = arr.map((object:any) => {
          return {
            //...object,
            time: object.time,
            open: object.open,
            high: toNum(object.high),
            low: toNum(object.low),
            close: toNum(object.close),
            volume: object.volume,
            isComplete: object.isComplete
          };
      });

      console.log(newCandles)
}

export const getColor = (val:number): string => {
    if(val === 1) return '#90EE90';
    if(val === -1) return 'red';
    return ''
}

export const get_candles_historical_as_json = async (ticker:string): Promise<string> => {
    return `[
  {
    "date": "2019-01-02T00:00:00Z",
    "open": 154.89,
    "high": 158.85,
    "low": 154.23,
    "close": 157.92,
    "volume": 37039700
  },
  {
    "date": "2019-12-27T00:00:00Z",
    "open": 291.12,
    "high": 293.97,
    "low": 288.12,
    "close": 289.8,
    "volume": 36566500
  },
  {
    "date": "2019-12-30T00:00:00Z",
    "open": 289.46,
    "high": 292.69,
    "low": 285.22,
    "close": 291.52,
    "volume": 36028600
  }
]`;
}

export const get_candles_historical_as_json2 = async (ticker:string): Promise<string> => {
    const share = await instrumentsService.get_share_by_ticker(ticker);
    // https://github.com/Tinkoff/investAPI/blob/main/src/docs/load_history.md
    let { candles } = await api.marketdata.getCandles({
        figi: share.figi,
        //from: moment('24.07.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
        from: moment('01.01.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
        to: moment('31.07.2022', "DD/MM/YYYY").toDate(),
        //to: moment('31.07.2022', "DD/MM/YYYY").toDate(),
        interval: CandleInterval.CANDLE_INTERVAL_DAY
    })

    candles.sort(function(a:any,b:any){ return a.time - b.time; })

    candles = candles.filter( (o:any) => {return o.volume > 10000})

    let newCandles = candles.map((object:any) => {
        return {
            //...object,
            // console.log(moment(2022-07-05T04:00:00.000Z, "DD MM YYYY hh:mm", true))
            // time: moment(object.time, "DD.MM.YYYY hh:mm"), SEC issue
            date: moment(object.time).format("YYYY-MM-DD").trim(), // %Y-%m-%d
            //date: moment(object.time).format("DD-MM-YYYY-hh:mm").trim(),
            open: toNum(object.open),
            high: toNum(object.high),
            low: toNum(object.low),
            close: toNum(object.close),
            volume: object.volume,
            //isComplete: object.isComplete
        };
    });

    return JSON.stringify(newCandles)
}


export const get_candles_historical = async (ticker:string): Promise<string> => {
  const share = await instrumentsService.get_share_by_ticker(ticker);

  let { candles } = await api.marketdata.getCandles({
    figi: share.figi,
    from: moment('01.07.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
    to: moment('28.08.2022', "DD/MM/YYYY").toDate(),
    interval: CandleInterval.CANDLE_INTERVAL_DAY
  })


  candles.sort(function(a:any,b:any){ return a.time - b.time; }) //return b.time - a.time;

  candles = candles.filter( (o:any) => {return o.volume > 10000})

    const date = candles.map( (nc:any) => { return moment(nc.time).format("YYYY-MM-DD") });
    const high = candles.map( (nc:any) => { return toNum(nc.high) });
    const close = candles.map( (nc:any) => { return toNum(nc.close) });
    const low = candles.map( (nc:any) => { return toNum(nc.low) });
    const open = candles.map( (nc:any) => { return toNum(nc.open) });
    const volume = candles.map( (nc:any) => { return nc.volume });

    let arr: (number | undefined)[][] = [];
    let arr_atr: { high: number | undefined, low: number | undefined, close: number | undefined }[] = [];

    candles.forEach((c:any) => {
      arr.push([toNum(c.high), toNum(c.close), toNum(c.low)])
    })

    candles.forEach((c:any) => {
      arr_atr.push({ high: toNum(c.high), low: toNum(c.low), close: toNum(c.close)})
    })

    //let array = newCandles2.map(obj => Object.values(obj));
    //   var stats = require("stats-analysis")
    
    
    const ta = require('ta.js');
    //var data = array
    //console.log(data)
    //console.log(data.length)
    //[[3,2,1], [2,2,1], [4,3,1], [2,2,1]]; // [high, close, low]
    var length = arr.length; // default = 14
    const atr = await ta.atr(arr, length);
    // console.log("atr: " + atr);
    console.log("arr_atr: " + JSON.stringify(arr_atr));

    const SuperTrend = require("supertrend-indicator");

    const factor = 3; // factor * ATR = расстояние стопа от текущей цены

    let superTrendData = SuperTrend(arr_atr, factor, arr_atr.length - 1);

    console.log('len ' + arr_atr.length)
    console.log('superTrendData ' + JSON.stringify(superTrendData))

    const upperBandBasic = superTrendData.map( (std:any) => { return std.upperBandBasic });
    const lowerBandBasic = superTrendData.map( (std:any) => { return std.lowerBandBasic });
    const upperBand = superTrendData.map( (std:any) => { return std.upperBand });
    const lowerBand = superTrendData.map( (std:any) => { return std.lowerBand });
    const supertrend = superTrendData.map( (std:any) => { return std.supertrend });
    const trendDirection = superTrendData.map( (std:any) => { return std.trendDirection });
    //const dates = candles.map((object:any) => {return object.date});

    const gap_dates = await instrumentsService.get_gap_dates(date)

    const trendDirection_colors = trendDirection.map( (val:number) => { return getColor(val) } );
    console.log(trendDirection_colors)

    const json = {
        date: date,
        gap_dates: gap_dates,
        high: high,
        close: close,
        low: low,
        open: open,
        volume: volume,
        atr: atr,
        superTrendData: {
          upperBandBasic: upperBandBasic,
          lowerBandBasic: lowerBandBasic,
          upperBand: upperBand,
          lowerBand: lowerBand,
          supertrend: supertrend,
          trendDirection: trendDirection,
          trendDirection_colors: trendDirection_colors,
        }
    }

  //console.log(candles)
  //candles.forEach( (c:HistoricCandle) => console.log("volume: " + c.volume))

  let newCandles = candles.map((object:any) => {
      return {
        //...object,
        // console.log(moment(2022-07-05T04:00:00.000Z, "DD MM YYYY hh:mm", true))
        // time: moment(object.time, "DD.MM.YYYY hh:mm"), SEC issue
        date: moment(object.time).format("YYYY-MM-DD").trim(), // %Y-%m-%d
        //date: moment(object.time).format("DD-MM-YYYY-hh:mm").trim(),
        open: toNum(object.open),
        high: toNum(object.high),
        low: toNum(object.low),
        close: toNum(object.close),
        volume: object.volume,
        //isComplete: object.isComplete
      };
  });

  

  const prepared_candles = newCandles.filter( (o:any) => {return o.volume > 10000})


const fields = ["date", "open", "high", "low", "close", "volume\n"];
let tsv = fields.join("\t");


prepared_candles.forEach ((pc:any) => {
    //const str = pc.date + "\t" + pc.open + "\t" + pc.high + "\t" + pc.low + "\t" + pc.close + "\t" + pc.volume
    const arr = [pc.open.toString(),pc.high.toString(),pc.low.toString(),pc.close.toString(),pc.volume.toString()].join("\t")

    //.reduce((previous:any, current:any) => { return previous + "\t" + current})
    tsv = tsv + pc.date.toString() + "\t" + arr //+ arr //.join("");
tsv = tsv + "\n"
})

//  var aoot = require('aoot')
//  //var d3 = require('d3')
// var tsv = aoot.tsv(prepared_candles)
// //tsv = tsv.replaceAll(/ +?/g, "\t").replaceAll('	', "\t");
// tsv = tsv.replaceAll(/[ \t\r]+/g, "\t").replace(/^\s+|\s+$/g, "\t")//.replaceAll('	', "\t");

//console.log('prepared_candles')
//добавить колонкми
//console.log(tsv)

//const parseDate = d3.timeParse("%d.%m.%Y H:M");
//console.log(parseDate(prepared_candles[0].time))
// console.log(prepared_candles[1])
// '    '
// '     '
// '        '
// '        '

//   const high = newCandles.map( (nc:any) => { return nc.high });
//   const close = newCandles.map( (nc:any) => { return nc.close });
//   const low = newCandles.map( (nc:any) => { return nc.low });
//   const volume = newCandles.map( (nc:any) => { return nc.volume });
//


      return JSON.stringify(json)
}


// export const SuperTrend = async (factor:number, atrPeriod:number) => {
    
// }
// // ещё нужны все таймфреймы
// SuperTrend(3, 15)


//checker();
//get_candles_historical('NVDA');




// const arr = [1, -1, 1].map( (val:number) => { return getColor(val) } );
// console.log(arr)














function filterOutliers(someArray: number[]) {

    if(someArray.length < 4)
        return someArray;

    let values, q1, q3, iqr, maxValue:number, minValue:number;

    values = someArray.slice().sort( (a, b) => a - b);//copy array fast and sort

    if((values.length / 4) % 1 === 0){//find quartiles
        q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
        q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
    } else {
        q1 = values[Math.floor(values.length / 4 + 1)];
        q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
    }

    iqr = q3 - q1;
    maxValue = q3 + iqr * 1.5;
    minValue = q1 - iqr * 1.5;

    return values.filter((x) => (x >= minValue) && (x <= maxValue));
}

function filterOutliers2(someArray: number[]) {

    // Copy the values, rather than operating on references to existing values
    var values = someArray.concat();

    // Then sort
    values.sort( function(a, b) {
        return a - b;
    });

    /* Then find a generous IQR. This is generous because if (values.length / 4)
     * is not an int, then really you should average the two elements on either
     * side to find q1.
     */
    var q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3.
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;

    // Then find min and max values
    var maxValue = q3 + iqr*1.5;
    var minValue = q1 - iqr*1.5;

    // Then filter anything beyond or beneath these values.
    var filteredValues = values.filter(function(x) {
        return (x <= maxValue) && (x >= minValue);
    });

    // Then return
    return filteredValues;
}

console.log(filterOutliers([1,8,125,150, 100000,800000,900000, 100000000]));
console.log(filterOutliers2([1,8,125,150, 100000,800000,900000, 100000000]));
console.log(filterOutliers([1,8,125,150, 100000,800000]));
console.log(filterOutliers2([1,8,125,150, 100000,800000]));