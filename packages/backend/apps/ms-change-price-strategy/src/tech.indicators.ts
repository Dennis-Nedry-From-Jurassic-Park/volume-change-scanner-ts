import {ATR} from "@debut/indicators";
import {GetCandlesResponse} from "tinkoff-invest-api/cjs/generated/marketdata";
import {toNum} from "../../ms-ti-base/number";
import {Quotation} from "tinkoff-invest-api/src/generated/common";

export enum Smoothing {
    SMA = 'SMA',
    EMA = 'EMA',
    SMMA = 'SMMA',
    WEMA = 'WEMA',
    LWMA = 'LWMA',
    EWMA = 'EWMA',
    RMA = 'RMA'
}

export const DEFAULT_PERIOD = 14;
export const DEFAULT_SMOOTHING = Smoothing.EMA;

type HistoricCandle = {
    open?: number | undefined,
    high?: number | undefined,
    low?: number | undefined,
    close?: number | undefined,
    volume: number | undefined,
    time?: Date,
    isComplete: boolean,
}

export const prepare_candles = async (
    candles: GetCandlesResponse,
    volume: number = 10000
): Promise<HistoricCandle[]> => {
    return candles.candles.map(object => {
        return {
            ...object,
            open: toNum(object.open) ,
            high: toNum(object.high),
            low: toNum(object.low),
            close: toNum(object.close),
        };
    }).filter(candle => candle.volume >= volume);
}

export const get_atr = async (
    period: number = DEFAULT_PERIOD,
    smoothing: Smoothing = DEFAULT_SMOOTHING
) => {
    const atr = new ATR(period, smoothing);
}
