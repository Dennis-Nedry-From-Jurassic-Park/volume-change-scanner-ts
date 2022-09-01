import secrets from '../../ms-base/src/utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import {CandleInterval} from 'tinkoff-invest-api/cjs/generated/marketdata';
import moment from 'moment';
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {toNum} from "../../ms-ti-base/number";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });


export interface PreparedCandle {
    date: string;
    volume: any;
    high: undefined | number;
    low: undefined | number;
    close: undefined | number;
    open: undefined | number
}


export const get_candles = async (ticker:string): Promise<PreparedCandle[]> => {
    const share = await instrumentsService.get_share_by_ticker(ticker);
    // https://github.com/Tinkoff/investAPI/blob/main/src/docs/load_history.md
    let { candles } = await api.marketdata.getCandles({
        figi: share.figi,
        //from: moment('24.07.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
        from: moment('01.05.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
        to: moment('03.08.2022', "DD/MM/YYYY").toDate(),
        //to: moment('31.07.2022', "DD/MM/YYYY").toDate(),
        interval: CandleInterval.CANDLE_INTERVAL_DAY
    })

    candles.sort(function(a:any,b:any){ return a.time - b.time; })

    candles = candles.filter( (o:any) => {return o.volume > 10000})

    let preparedCandles: PreparedCandle[]  = candles.map((object:any) => {
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



    return preparedCandles
}

const gap_watch = async (ticker:string): Promise<PreparedCandle | null | undefined> => {

    const candles: PreparedCandle[] = await get_candles(ticker);

    //console.log(candles)
    //for (let i in candles) {

    const additive = 0.25
    //console.log(candles!.length)

    let gap_prev: any;
    let gap_curr: any;

    let gaps = []

    for(let i=0; i < candles.length - 1; i++) {
        const prev = candles[i];
        const curr = candles[i+1];

        const condition = Math.abs(curr.open! - prev.close!) >= additive; // нашли гэп

        if(condition) {
            for(let k=i+1;k<candles.length - 1;k++) {
                const candle = candles[k];
                gap_prev = prev;
                gap_curr = curr;

                if(candle.high! + additive < gap_prev!.close!){

                } else if (candle.low! + additive > gap_prev!.close!) {

                } else {
                   gap_prev = null;
                   gap_curr = null; // gap closed
                }
            }
        }

        //console.log(gap_prev)
        //console.log(gap_curr)


    }

    console.log(ticker)
    console.log(gap_curr)
    return gap_curr;
}

gap_watch('TSM')

/*

TSM
{
  date: '2022-08-01',
  open: 87.2,
  high: 87.35,
  low: 84.29,
  close: 86.24,
  volume: 2163021
}



MOMO
{
  date: '2022-06-16',
  open: 5.26,
  high: 5.3,
  low: 4.92,
  close: 5.05,
  volume: 1114031
}



SNAP
{
  date: '2022-04-04',
  open: 38.28,
  high: 39.56,
  low: 37.37,
  close: 39.4,
  volume: 2546005
}

SNAP
{
  date: '2022-07-22',
  open: 11.48,
  high: 11.5,
  low: 9.88,
  close: 9.9,
  volume: 25015580
}

FSLY
{
  date: '2022-07-19',
  open: 11.71,
  high: 11.98,
  low: 11.14,
  close: 11.4,
  volume: 1063160
}


 */