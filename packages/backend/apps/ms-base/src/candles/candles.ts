import {instrumentsService} from "../../../ms-ti-base/instruments.service";
import {api} from "../../../ms-ti-base/api";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";


export const get_historical_candles = async (
    ticker: string,
    from: Date,
    to: Date, // GetCandlesResponse
    timeframe: CandleInterval,
): Promise<any> => {
    const share = await instrumentsService.get_share_by_ticker(ticker);

    console.log(from)
    console.log(to)

    let candles = await api.marketdata.getCandles({
        figi: share.figi,
        from: from,
        to: to,
        interval: timeframe
    })

    candles.candles.sort(function (a: any, b: any) {
        return a.time - b.time;
    }) //return b.time - a.time;

    candles.candles.filter((o: any) => {
        return o.volume > 10000
    })

    // const date = candles.map((nc: any) => {
    //     return moment(nc.time).format("YYYY-MM-DD hh:mm")
    // });
    // const high = candles.map((nc: any) => {
    //     return toNum(nc.high)
    // });
    // const close = candles.map((nc: any) => {
    //     return toNum(nc.close)
    // });
    // const low = candles.map((nc: any) => {
    //     return toNum(nc.low)
    // });
    // const open = candles.map((nc: any) => {
    //     return toNum(nc.open)
    // });
    // const volume = candles.map((nc: any) => {
    //     return nc.volume
    // });

    // const json = {
    //     date: date,
    //    // high: undefined,
    //     close: close,
    //     low: low,
    //     open: open,
    //     volume: volume
    // }

    return candles
}