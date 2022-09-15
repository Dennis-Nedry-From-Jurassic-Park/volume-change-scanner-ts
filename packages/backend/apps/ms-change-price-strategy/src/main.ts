import {ATR, ROC, SuperTrend} from '@debut/indicators';
import {api} from "../../ms-ti-base/api";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import moment from "moment";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import {toNum} from "../../ms-ti-base/number";
import assert from "assert";
import {delay} from "../../ms-ti-base/wait";
import {prettyJSON} from "../../ms-ti-base/output";
import {OperationState, OperationType} from "tinkoff-invest-api/cjs/generated/operations";
import {ACCOUNT} from "../../ms-ti-base/users.service";
import {HistoricCandle} from "tinkoff-invest-api/dist/generated/marketdata";
import {get_historical_candles} from "../../ms-base/src/candles/candles";
import {isHoliday} from "nyse-holidays";
//import {moment_business_days} from "../../ms-trading-calendar/ms-trading-calendar";
import mb from 'moment-business';
import {getPreviousWorkday} from "../../ms-trading-calendar/ms-trading-calendar";
import {exec} from "./algo";


interface OwnCandle {
    date: string[],
    high?: (number | undefined)[],
    close: (number | undefined)[],
    low: (number | undefined)[],
    open: (number | undefined)[],
    volume: any[]
}


//const validol = require('validol')


const ticker = 'PATH'
const from  = '08.08.2022'
const to    = '09.08.2022' // moment().toDate()
const interval = CandleInterval.CANDLE_INTERVAL_15_MIN



const fromDate = moment(from, "DD/MM/YYYY").add(3, 'hour').toDate()
const toDate = moment(to, "DD/MM/YYYY").subtract(1, 'second').toDate()


const main_json = async () => {
    const json = JSON.parse(`{"status":"runned","prepare_candles_moex_exchange":"done","prepare_candles_spbe_exchange_morning_session":"done","prepare_candles_spbe_exchange_main_session":"fail","start_dt":"2022-09-09T14:03:46.760Z","end_dt":"2022-09-09T14:39:03.344Z"}`);

    assert(json.status === 'runned', '---')
    assert(json.prepare_candles_moex_exchange === 'done', 'prepare_candles_moex_exchange')
    assert(json.prepare_candles_spbe_exchange_main_session === 'fail', 'prepare_candles_spbe_exchange_main_session')
}
const main2 = async () => {
    const {candles} = await get_historical_candles(
        ticker,
        fromDate,
        toDate,
        interval
    );

    const period = 15

    const date = candles.map((nc: any) => {
        return moment(nc.time).format("YYYY-MM-DD hh:mm")
    });
    const high = candles.map((nc: any) => {
        return toNum(nc.high)
    });
    const close = candles.map((nc: any) => {
        return toNum(nc.close)
    });
    const low = candles.map((nc: any) => {
        return toNum(nc.low)
    });

    let ATR = require('technicalindicators').ATR

    let input = {
        high: high,
        low: low,
        close: close,
        period: period
    }


    console.log(ATR.calculate(input));
}
const main111 = async () => {
    let example = new Map()

    example.set('value', 10) // set initial value
    example.set('value', example.get('value') - 1)

    console.log(example)
    console.log(prettyJSON(example))

    let jsonObject = {};
    example.forEach((value, key) => {
        jsonObject[key] = value
    });
    console.log(prettyJSON(jsonObject))
    console.log(jsonObject)
}
const main = async () => {

    const candles = await get_historical_candles(
        ticker, //'PATH',
        fromDate,
        toDate,
        interval
    );

    const period = 14// candles.candles.length;
    //console.log(candles);

    //const candles = await api.marketdata.getCandles()

    //const period = 1//candles.candles.length
    console.log(period);

    //const keysOfProps = keys<OwnCandle>();
    // const validator = validol(candles, [
    //     'date',
    //     'high',
    //     'close',
    //     'low',
    //     'open',
    //     'volume'
    // ]);
    // //console.log(validator)
    // assert(validator.error === false, 'some errors')

    assert(candles.candles.length >= period, 'candles length must be greater than period')

    const smoothing = 'EMA'
    const atr = new ATR(period, smoothing); // SMMA WEMA
    const roc = new ROC(period); // SMMA WEMA
    const atr_factor = 3;
    const st = new SuperTrend(period, atr_factor, smoothing);

    const atrs: any[] = [];
    const rocs: any[] = [];
    const super_trend: any[] = [];
    //for(const tick of candles.candles){
    candles.candles.forEach((tick: any) => {
        //console.log(tick)
        const high = toNum(tick.high)!
        const low = toNum(tick.low)!
        const close = toNum(tick.close)!
        const nv_atr = atr.nextValue(high, low, close);
        const nv_roc = roc.nextValue(close);
        const nv_st = st.nextValue(high, low, close);
        console.log(`${moment(tick.time).format('YYYY-MM-DD HH:mm')} : ${high} : ${low} : ${close} : ${nv_atr} : ${nv_roc}% : ${nv_st}`)
            //console.log(`${moment(tick.time).format('YYYY-MM-DD HH:mm')} : ${high} : ${low} : ${close} : ${nv_st?.upper} : ${nv_st?.superTrend} : ${nv_st?.lower} : ${nv_st?.direction}`)
        atrs.push(nv_atr);
        rocs.push(nv_roc);
        super_trend.push(super_trend);
    })
    console.log(atrs)


    //const levels = new UniLevel<typeof EMA>(0.99, EMA, 3, 2, 0);
    //const period = 12;


    // for(const tick of candles.candles){
    //     console.log(tick)
    //     console.log(candles.candles.length)
    //     console.log(atr.nextValue(toNum(tick.high)!, toNum(tick.low)!, toNum(tick.close)!))
    //     atrs.push(atr.nextValue(toNum(tick.high)!, toNum(tick.low)!, toNum(tick.close)!));
    // }
    //
    // candles.candles.forEach((tick: HistoricCandle) => {
    //     console.log(tick)
    //     const nv = atr.nextValue(toNum(tick.high)!, toNum(tick.low)!, toNum(tick.close)!);
    //     atrs2.push(nv);
    //
    //
    // });

    // console.log(atrs)
    //console.log(atrs.length)
    //console.log(atrs2)

    // await price_change_rus_shares()
    //     .then(() => console.log('get price changes for russian shares'));
}
//main();
//main2();
//main();





const get_$_currency_at_moment = async (date: Date): Promise<HistoricCandle> => {
    await delay(100)

    const ethalon = moment(date).set({h: 16, m: 0, s: 0});
    const h = moment(date).hour();
    const dt = (h < 7 || h > 16) ? ethalon : moment(date);

    //await delay(250000)

    const $_ = await api.marketdata.getCandles({
        figi: 'BBG0013HGFT4',
        from: moment(dt).seconds(0).milliseconds(0).subtract(0, 'seconds').toDate(),
        to: moment(dt).seconds(0).milliseconds(0).add(1, 'minute').toDate(),
        interval: CandleInterval.CANDLE_INTERVAL_1_MIN
    })
    console.log(dt);
    console.log(ethalon);
    console.log(moment(date));
    return $_.candles[0];
}
const main3 = async () => {
//     await delay(250)
//     const $_ = await api.marketdata.getCandles({
//         figi: 'BBG0013HGFT4',
//         from: moment(date).seconds(0).milliseconds(0).subtract(0, 'seconds').toDate(),
//         to: moment(date).seconds(0).milliseconds(0).add(1, 'minute').toDate(),
//         interval: CandleInterval.CANDLE_INTERVAL_1_MIN
//     })
//     сщтыщдуюдщп() $_.candles[0];
// await delay(50000000)


    const $_figi = 'BBG0013HGFT4'
    const $_resp = await api.marketdata.getLastPrices({figi: [$_figi]});
    const $ = $_resp.lastPrices.filter(it => it.figi === $_figi)[0];


    assert($.price !== undefined, `figi=${$.figi}. price from response ${$.price}`)
    //console.log('$='+prettyJSON($))


    //await delay(500000000);


    //await delay(500000000)


    const $_currency_curr = toNum($.price);
    // MOMO - получить все операции по ней за год
    const num_shares= 33;

    const ticker = 'MOMO';
    // BBG007HTCQT0 BBG007HTCQT0
    // US4234031049
    const share = await instrumentsService.get_share_by_ticker(ticker);

    const operations = await api.operations.getOperationsByCursor({
        accountId: ACCOUNT.BROKERAGE,
        instrumentId: share.figi,
        from: moment('01.01.2019', "DD/MM/YYYY").add(3, 'hour').toDate(),
        to: moment('03.09.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
        cursor: '',
        limit: 1000,
        operationTypes: [OperationType.OPERATION_TYPE_BUY, OperationType.OPERATION_TYPE_SELL],
        state: OperationState.OPERATION_STATE_EXECUTED,
        withoutCommissions: false,
        withoutTrades: false,
        withoutOvernights: true
    })
// WMC_old

    // const shares = await api.instruments.shares({
    //     instrumentStatus: InstrumentStatus.INSTRUMENT_STATUS_ALL
    // })
    // await asyncWriteFile('../../json2.json', prettyJSON(shares))
    // await delay(500000000);
    // const share_old = await api.instruments.shareBy({
    //     idType: InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI,
    //     classCode: "",
    //     id: 'US4234031049'
    // });
    //
    // console.log(share_old)

    // const operations_old = await api.operations.getOperationsByCursor({
    //     accountId: ACCOUNT.BROKERAGE,
    //     instrumentId: '7e44ee00-0912-4ae5-8992-1069b85329e3',
    //     from: moment('01.01.2021', "DD/MM/YYYY").add(3, 'hour').toDate(),
    //     to: moment('03.09.2022', "DD/MM/YYYY").add(3, 'hour').toDate(),
    //     cursor: '',
    //     limit: 1000,
    //     operationTypes: [OperationType.OPERATION_TYPE_BUY, OperationType.OPERATION_TYPE_SELL],
    //     state: OperationState.OPERATION_STATE_EXECUTED,
    //     withoutCommissions: false,
    //     withoutTrades: false,
    //     withoutOvernights: true
    // })
    // console.log(prettyJSON(operations_old))



    let total_buy = 0
    let total_buy_comissions = 0
    let total_sell = 0
    let total_sell_comissions = 0
    let countBuy = 0
    let countSell = 0

    for(const item of operations.items){
        assert(item.figi === share.figi, `share ${share.figi} !== item ${item.figi}`)

        //const buy = toNum(item.price)! * item.quantityDone


        //assert(item.figi === share.figi, `share ${share.figi} !== item ${item.figi}`)

        if(item.type === OperationType.OPERATION_TYPE_BUY){
            for(const trade of item.tradesInfo?.trades!){
                const $ = await get_$_currency_at_moment(trade.date!)
                total_buy += toNum(trade.price)! * trade.quantity * toNum($.close!)!;
            }
            const $ = await get_$_currency_at_moment(item.date!)
            total_buy_comissions += toNum(item.commission)! * toNum($.close!)!
            countBuy += item.quantityDone;
        }

        if(item.type === OperationType.OPERATION_TYPE_SELL){
            for(const trade of item.tradesInfo?.trades!){
                const $ = await get_$_currency_at_moment(trade.date!)
                total_sell += toNum(trade.price)! * trade.quantity * toNum($.close!)!;
            }
            const $ = await get_$_currency_at_moment(item.date!)
            total_sell_comissions += toNum(item.commission)! * toNum($.close!)!
            countSell += item.quantityDone;
            //total_sell += toNum(item.price)! * item.quantityDone + toNum(item.commission)!
        }
    }

    const total_b = total_buy + total_buy_comissions;
    const add = 1 * 15.85 * 70;
    const total_s = total_sell + total_sell_comissions;
    console.log(total_b)
    console.log(total_buy_comissions)
    console.log(total_s)
    console.log(total_sell_comissions)

    //const unique = [...new Set(operations.items.map(item => item.type))];
    //console.log(unique)
    console.log(countBuy)
    console.log(countSell)
    //const F = 5.34 * num_shares * $_currency_curr! - 5.32 * num_shares * 59;
    //console.log(F)

    console.log(total_s - (total_b + Math.abs(total_buy_comissions) + Math.abs(total_sell_comissions) + add))
}

//main();

//const isWeekDay()





const exec3 = async () => {
    let prev = moment().subtract(1, 'day')//.format('YYYY-MM-DD');
    let prev_day: any = moment(prev.format('YYYY-MM-DD')).toDate();
    if(isHoliday(prev_day)) {
        prev_day = mb(prev).prevBusinessDay();
    } else if(mb.isWeekendDay(prev)) {
        prev_day = getPreviousWorkday(prev);
    }
    console.log(prev)
    console.log(mb.isWeekendDay(prev))
    console.log(prev_day)
}
const exec2 = async () => {
   // const eth =
    const timestamp = moment("2022-09-11T09:00:01.234Z").valueOf()
    const timestamp2 = moment("2022-09-11T09:00:01.234Z").format("X")
    const milliseconds = moment("2022-09-11T09:00:01.234Z").format("X")

    // 1662886800000

    const ts = Math.floor(timestamp / 1e3)
    const ms = timestamp % 1e3

    console.log(timestamp)
    console.log(ts)
    console.log(ms)

    console.log(prettyJSON(timestamp2))
    console.log(moment(timestamp).toISOString())

    assert(timestamp === ts * 1e3 + ms, `${timestamp} != ${ts * 1e3 + ms}`);
    console.log(moment(ts * 1e3 + ms).toISOString())
    // "2022-09-11T09:00:00.000Z"
}
const exec1111 = async () => {
    const ticker = 'NVDA';

    const format = 'DD.MM.YYYY';
    const dateFrom = '05.09.2022';
    const dateTo = moment(new Date()).format(format);

    //const candlesLoader = new CandlesLoader(api, { cacheDir: '.cache.ti.api.gs.ru.shares.report' });

    const share = await instrumentsService.get_share_by_ticker(ticker);
        let {candles} = await api.marketdata.getCandles({
            figi: share.figi,
            from: moment(dateFrom, format).toDate(),
            to: moment(dateTo, format).toDate(),
            interval: CandleInterval.CANDLE_INTERVAL_HOUR
            // ...api.helpers.fromTo('-5m'), // <- удобный хелпер для получения { from, to }
        });
        console.log(prettyJSON(candles))
}
exec().then(r => r)
//exec2();
//main_json();
//main111();


