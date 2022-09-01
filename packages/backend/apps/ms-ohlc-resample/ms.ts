import {resampleOhlcv, resampleTicksByTime, resampleTicksByCount, IOHLCV, OHLCV} from "ohlc-resample";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import assert from "assert";
import moment from "moment";

// OHLCV resampled from 1 minute to 5 minute


const link_btc_1m = [
    {
        time: 1563625680000,
        open: 0.00024824,
        high: 0.00024851,
        low: 0.00024798,
        close: 0.00024831,
        volume: 2264
    },
    {
        time: 1563625740000,
        open: 0.00024817,
        high: 0.00024832,
        low: 0.00024792,
        close: 0.00024828,
        volume: 3145
    },
    {
        time: 1563625740000,
        open: 0.00034817,
        high: 0.00124832,
        low: 0.00024795,
        close: 0.00024828,
        volume: 3145
    }
];

const baseTimeframe = 60; // 60 seconds
const newTimeframe = 180; // 120 seconds

// Candles made up of ticks within 2 minute timeframes

const link_btc_2m = resampleOhlcv(link_btc_1m, {
    baseTimeframe,
    newTimeframe
});

const convert_candle_interval_to_seconds = (interval: CandleInterval): number => {
    const minute = 60; // seconds
    switch (interval) {
        case CandleInterval.CANDLE_INTERVAL_1_MIN:
            return minute;
            break;
        case CandleInterval.CANDLE_INTERVAL_5_MIN:
            return minute * 5;
            break;
        case CandleInterval.CANDLE_INTERVAL_15_MIN:
            return minute * 15;
            break;
        case CandleInterval.CANDLE_INTERVAL_HOUR:
            return minute * 60;
            break;
        case CandleInterval.CANDLE_INTERVAL_DAY:
            return minute * 60 * 24; // TODO: возможно неверно
            break;
        default:
            throw Error('Invalid CandleInterval ' + interval);
    }

}

const resample_candles = (candles: any[], baseTimeframe_: CandleInterval, newTimeframe_: CandleInterval) => {
    const baseTimeframe: number = convert_candle_interval_to_seconds(baseTimeframe_)
    const newTimeframe: number = convert_candle_interval_to_seconds(newTimeframe_)
    //candles.forEach(it => assert(it.))

// https://itecnote.com/tecnote/javascript-round-up-round-down-a-momentjs-moment-to-nearest-minute/

    const prepared_candles = resampleOhlcv(candles, {
        baseTimeframe,
        newTimeframe
    });
    return prepared_candles;
}

console.log(resample_candles(link_btc_1m, CandleInterval.CANDLE_INTERVAL_1_MIN, CandleInterval.CANDLE_INTERVAL_5_MIN));

const round_minute = () => {
    const now = moment();
    console.log(now)
    if (now.seconds() > 0 && now.seconds() <= 30) {
        now.add('minutes', -1);
    } else {
        now.add('minutes', +1);
    }
    now.seconds(0);
    console.log(now)
}

//resampleOhlcv(objectOhlcv as IOHLCV[], { baseTimeframe: 60, newTimeframe: 5*60 }) // return IOHLCV[]
//resampleOhlcv(arrayOhlcv as OHLCV[], { baseTimeframe: 60, newTimeframe: 5*60 }) // return OHLCV[]
