import {resampleOhlcv, resampleTicksByTime, resampleTicksByCount, IOHLCV, OHLCV} from "ohlc-resample";

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

console.log(link_btc_2m)


//resampleOhlcv(objectOhlcv as IOHLCV[], { baseTimeframe: 60, newTimeframe: 5*60 }) // return IOHLCV[]
//resampleOhlcv(arrayOhlcv as OHLCV[], { baseTimeframe: 60, newTimeframe: 5*60 }) // return OHLCV[]
