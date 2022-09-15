import {CandleInterval, GetCandlesResponse} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {get_historical_candles} from "../../ms-base/src/candles/candles";
import {api} from "../../ms-ti-base/api";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {SubscriptionInterval} from "tinkoff-invest-api/dist/generated/marketdata";
import {ATR, ROC} from "@debut/indicators";
import {prepare_candles, Smoothing} from "./tech.indicators";

export const formatDT = (
    time: Date,
    format: string = 'YYYY-MM-DD HH:mm'
): string => {
    return moment(time).format(format)
}


export const exec = async () => {
    // от старшего таймфtimeрейма к младшему
    let tickers = ['YNDX']; // сюда добавляем тикеры из таблицы

    const default_period = 14; // последних значений (баров)

    const smoothing = Smoothing.EMA
    const atr = new ATR(default_period, smoothing); // SMMA WEMA
    const roc = new ROC(default_period); // SMMA WEMA
    const atr_factor = 3;

    const atrs: any[] = [];
    const rocs: any[] = [];


    // TODO: unary for DAY, Hour, and stream minutes

    for(const ticker of tickers) {
        const share = await instrumentsService.get_share_by_ticker(ticker);

        let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_5_MIN;
        const from = moment().add(3, 'hour').subtract(1, 'days');

        //let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_5_MIN;
        //const from = moment().add(3, 'hour').subtract(2, 'day'); // 'week'
        const to = moment().add(3, 'hour')

        const candles_ = await get_historical_candles(
            ticker,
            from.toDate(),
            to.toDate(),
            tf_candle_interval
        );

        const candles = await prepare_candles(candles_, 0);

        for(const c of candles) {
            const nv_atr = atr.nextValue(c.high!, c.low!, c.close!);
            const nv_roc = roc.nextValue(c.close!);

            console.log(
                `${formatDT(c.time!)} : ${c.open} : ${c.high} : ${c.low} : ${c.close} : ${c.volume} : ` +
                    `${nv_atr} : ${nv_roc}%`
            )

        }


    }

    // let tf = SubscriptionInterval.SUBSCRIPTION_INTERVAL_ONE_MINUTE;
    // // подписка на свечи
    // const instruments = await get_shares_for_trading(tickers, tf);
    // const unsubscribe = await api.stream.market.candles({
    //     instruments: instruments,
    //     waitingClose: false,
    // }, candle => console.log(candle));
    //
    // // отписаться
    // await unsubscribe();
    //
    // // обработка дополнительных событий
    // api.stream.market.on('error', error => console.log('stream error', error));
    // api.stream.market.on('close', error => console.log('stream closed, reason:', error));
    //
    // // получить список текущих подписок
    // const data = await api.stream.market.getMySubscriptions();
    //
    // // закрыть соединение
    // await api.stream.market.cancel();
}

type FigiPerSubscriptionInterval = { figi: string, interval: SubscriptionInterval };

const get_shares_for_trading = async (
    tickers: string[],
    tf: SubscriptionInterval
): Promise<FigiPerSubscriptionInterval[]>  => {
    const instruments: FigiPerSubscriptionInterval[] = [];
    for(const ticker of tickers) {
        const share = await instrumentsService.get_share_by_ticker(ticker);

        instruments.push( { figi: share.figi, interval: tf })
    }
    return instruments;
}