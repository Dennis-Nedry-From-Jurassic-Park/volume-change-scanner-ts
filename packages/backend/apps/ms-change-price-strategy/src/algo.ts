import {CandleInterval, GetCandlesResponse} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {get_historical_candles} from "../../ms-base/src/candles/candles";
import {api} from "../../ms-ti-base/api";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {SubscriptionInterval} from "tinkoff-invest-api/dist/generated/marketdata";


const exec = async () => {
    // от старшего таймфрейма к младшему
    let tickers = ['NVDA']; // сюда добавляем тикеры из таблицы

    const period = 14; // последних значений (баров)


    // TODO: unary for DAY, Hour, and stream minutes

    for(const ticker of tickers) {
        const share = await instrumentsService.get_share_by_ticker(ticker);

        let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_DAY;
        const to = moment()
        let from = to.subtract(14, 'days');

        const fromDate = from.add(3, 'hour').toDate()
        const toDate = to.toDate()

        const { candles } = await get_historical_candles(
            ticker,
            fromDate,
            toDate,
            tf_candle_interval
        );



        let tf = SubscriptionInterval.SUBSCRIPTION_INTERVAL_ONE_MINUTE;
        // подписка на свечи
        const instruments = await get_shares_for_trading(tickers, tf);
        const unsubscribe = await api.stream.market.candles({
            instruments: instruments,
            waitingClose: false,
        }, candle => console.log(candle));

        // отписаться
        await unsubscribe();

        // обработка дополнительных событий
        api.stream.market.on('error', error => console.log('stream error', error));
        api.stream.market.on('close', error => console.log('stream closed, reason:', error));

        // получить список текущих подписок
        const data = await api.stream.market.getMySubscriptions();

        // закрыть соединение
        await api.stream.market.cancel();
    }
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