import {CandleInterval, GetCandlesResponse} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {get_historical_candles} from "../../ms-base/src/candles/candles";
import {api} from "../../ms-ti-base/api";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {SubscriptionInterval} from "tinkoff-invest-api/dist/generated/marketdata";
import {ATR, ROC} from "@debut/indicators";
import {prepare_candles, Smoothing} from "./tech.indicators";
import {get_russian_shares} from "../../ms-ti-base/api.ti.service.utils";
import {delay} from "../../ms-ti-base/wait";
import {prettyJSON} from "../../ms-ti-base/output";
import {isHoliday} from "nyse-holidays";
import {getPreviousWorkday} from "../../ms-trading-calendar/src/ms-trading-calendar";
import {DAY} from "../../ms-base/src/constants/date.time.formats";
import {insert_candles} from "./prepare-candles";
import assert from "assert";


const MomentRange = require('moment-range');



export const formatDT = (
    time: Date,
    format: string = 'YYYY-MM-DD HH:mm'
): string => {
    return moment(time).format(format)
}

type Row = {
    t: string,
    p?: number,
    curr_price_h?: number,
    p_prev_day_close_h?: number,
    p_curr_day_open_h?: number,
    atr_prev_day_close_h?: number,
    atr_curr_day_open_h? : number,
    atr_curr_day_last_h? : number,
    roc_curr_day_last_h? : number
}
type Row0 = {
    t: string,
    lowest?: number,
    highest?: number,
    percent?: number,
    time_low?: any,
    time_high?: any




}

export const exec = async () => {
    // от старшего таймфtimeрейма к младшему
    const shares = await get_russian_shares(false);
    let tickers = ['YNDX'] //shares.map((it) => { return it.ticker });//['YNDX', 'PIKK', 'LKOH']; // сюда добавляем тикеры из таблицы

    const default_period = 14; // последних значений (баров)

    const smoothing = Smoothing.EMA
    const atr = new ATR(default_period, smoothing); // SMMA WEMA
    const roc = new ROC(default_period); // SMMA WEMA
    const atr_factor = 3;

    const atrs: any[] = [];
    const rocs: any[] = [];
    const failed_tickers: any[] = [];

    let final_struct: Row[] = [];
    let final_struct_0: Row[] = [];


    // TODO: unary for DAY, Hour, and stream minutes

    const today = moment(moment().format('YYYY-MM-DD') + ' ' + '07:00').add(+3,'hours');
    const h_0959 = today.subtract(1, 'minute').format('YYYY-MM-DD hh:mm');
    const h_1001 = today.add(1, 'minute').format('YYYY-MM-DD hh:mm');

    for(const ticker of tickers) {
        const share = await instrumentsService.get_share_by_ticker(ticker);

        let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_HOUR;
        const from = moment().add(3, 'hour').subtract(7, 'days');

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

        let atrs: number[] = [];
        let rocs: number[] = [];

        //console.log('ticker: ' + ticker);
        //console.log('candles len: ' + candles.length);

        if(candles.length > 0) {

        } else {
            failed_tickers.push(ticker)
            continue;
        }

        let row: Row = { t: ticker };

        row.curr_price_h = +candles[candles.length - 1].close!.toFixed(2);

        for(const c of candles) {
            const nv_atr = atr.nextValue(c.high!, c.low!, c.close!);
            const nv_roc = roc.nextValue(c.close!);

            const cond1 = moment(c.time!).isBetween('2022-09-18 17:59', '2022-09-18 18:01');
            const cond2 = moment(c.time!).isBetween('2022-09-19 22:59', '2022-09-19 23:01');

            if(cond1 || cond2) {
                row.p_prev_day_close_h = +c.close!.toFixed(2);
                row.atr_prev_day_close_h = +nv_atr.toFixed(2);
            }

            //console.log(h_0959)
            console.log(c.time!)
            console.log(moment(c.time!, 'YYYY-MM-DD hh:mm').subtract(3, 'hour'))

            await delay(6000000)

            if(moment(c.time!).subtract(3, 'hour').isBetween(h_0959, h_1001)) {
                row.p_curr_day_open_h = +c.high!.toFixed(2);
                row.atr_curr_day_open_h = +nv_atr.toFixed(2);
            }

            // console.log(
            //     `${formatDT(c.time!)} : ${c.open} : ${c.high} : ${c.low} : ${c.close} : ${c.volume} : ` +
            //         `${nv_atr} : ${nv_roc}%`
            // )

            atrs.push(nv_atr);
            rocs.push(nv_roc);
        }

        //console.log(atrs)
        const last_atr = atrs[atrs.length - 1];
        const last_roc = rocs[rocs.length - 1];
        //console.log(last_atr)
        //console.log(last_roc)

        row.atr_curr_day_last_h = +last_atr.toFixed(2);
        row.roc_curr_day_last_h = +last_roc.toFixed(2);
        row.p = +(row.p_curr_day_open_h! / row.atr_curr_day_open_h!).toFixed(2)

        //console.log(row)

        final_struct.push(row)

        atrs = [];
        rocs = [];

    }


    // final_struct.map((row: Row) =>  {
    //     return {
    //         ...row,
    //         row
    //     }
    //
    //
    // })

    //const sorted_map = final_struct.sort((a, b) => - a.atr_curr_day_open_h! + b.atr_curr_day_open_h!)
    const sorted_map = final_struct.sort((a, b) => a.p! - b.p!)

    console.table(sorted_map)
    console.table(sorted_map.filter((it) => it.curr_price_h! <= 16999 && it.roc_curr_day_last_h! > -3.22 && it.roc_curr_day_last_h! < 10 ))
    console.log(failed_tickers)

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

const exec8 = async () => {
    const ticker = 'AAPL'
    const share = await instrumentsService.get_share_by_ticker(ticker);

    let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_1_MIN;
    const from = moment('2022-09-21').add(3, 'hour')//.subtract(1, 'days');

    //let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_5_MIN;
    //const from = moment().add(3, 'hour').subtract(2, 'day'); // 'week'
    const to = moment('2022-09-22').add(3, 'hour')

    const candles_ = await get_historical_candles(
        ticker,
        from.toDate(),
        to.toDate(),
        tf_candle_interval
    );

    const candles = await prepare_candles(candles_, 0);


    await insert_candles(
        [ticker],
        '2022-09-21 13:20:00',
        '2022-09-21 23:44:00',
        CandleInterval.CANDLE_INTERVAL_1_MIN
    );

}
const exec7 = async () => {
    const today = moment(moment().subtract(1, 'day').format('YYYY-MM-DD') + ' ' + '23:00')//.add(+0,'hours');
    console.log(today.format('YYYY-MM-DD hh:mm'))
    console.log(today.subtract(3, 'hour').subtract(1, 'minute').format('YYYY-MM-DD hh:mm'))
    console.log(today.subtract(3, 'hour').add(1, 'minute').format('YYYY-MM-DD hh:mm'))
}








const exec_ = async () => {
    const gap_dates = [];

    const ticker = 'NVDA'
    const share = await instrumentsService.get_share_by_ticker(ticker);

    let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_1_MIN;
    const from = moment('2022-09-23 17:00')//.add(3, 'hour')//.subtract(1, 'days');

    //let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_5_MIN;
    //const from = moment().add(3, 'hour').subtract(2, 'day'); // 'week'
    const to = moment('2022-09-23 18:00')//.add(3, 'hour')

    const candles_ = await get_historical_candles(
        ticker,
        from.toDate(),
        to.toDate(),
        tf_candle_interval
    );

    const candles = await prepare_candles(candles_, 0);

    //console.log(prettyJSON(candles))

    let times = candles.map((it) => {
        return it.time
    });
    times.push(moment("2022-09-23T15:00:00.000Z").toDate())
    times.push(moment("2022-09-23T15:05:00.000Z").toDate())
    //console.log(prettyJSON(times))

    for(let i = 0; i < times.length-1; i++) {
        let a = moment(times[i],  'DD-MM-YYYY hh:mm');
        let b = moment(times[i+1],  'DD-MM-YYYY hh:mm');



        const diff = b.diff(a, 'minutes');// / (60 * 1000);

        if(diff !== 1){
            const Moment = require('moment');
            const moment_range = MomentRange.extendMoment(Moment);
            const range = moment_range.range(a, b);
            //console.log(range)
            console.log(range.center());
            //console.log(moment_range(b).within(range))
            console.log(getDatesListBetweenStartEndDates(a,b))

            //gap_dates.push(a.add(1, ''))
           // console.log(b.diff(a, 'minutes'))
            var duration = moment.duration(b.diff(a, 'minutes'));
           // console.log(duration)

            var mi = duration.asMinutes();
           // console.log(mi)

            // console.log(a)
            // console.log(getDatesInRange(a.toDate(), b.toDate()))
            // console.log(b)

        }

        // console.log(a)
        // console.log(b)
        // console.log(diff)



        assert(diff === 1, `${a} !== ${b}, ${diff}`)
    }



    // await insert_candles(
    //     [ticker],
    //     '2022-09-21 13:20:00',
    //     '2022-09-21 23:44:00',
    //     CandleInterval.CANDLE_INTERVAL_1_MIN
    // );

}

// function getDatesInRange2(fromDate, endDate) {
//     let dateArr = []; //Array where dates will be stored
//
//     //let fromDate = new Date(moment().format('MM-DD-YYYY')); //From Date
//
// //Let's assume the endDate to be 15 days later from today
//     //let endDate = new Date(moment().add(15, 'days').format('MM-DD-YYYY'));
//
// //Logic for getting rest of the dates between two dates("FromDate" to "EndDate")
//     while(fromDate < endDate){
//         dateArr.push(moment(fromDate).format('ddd DD-MM'));
//         let newDate = fromDate.setDate(fromDate.getDate() + 1);
//         fromDate = newDate(newDate);
//     }

// //Print all dates
//     console.log(dateArr)
// }

function getDatesListBetweenStartEndDates(startDate, stopDate) {
    let dates: any[] = []
    let dateObj = {};
    let currentDate = moment(startDate).add(1, 'minute')
    stopDate = moment(stopDate);
    while (currentDate < stopDate) {
        dates.push(currentDate);
        dateObj[`${moment(currentDate).format('YYYY-MM-DD hh:mm')}`] = 0;
        currentDate = moment(currentDate).add(1, 'minute');

    }

    return dates;
}


function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());

    const dates: Date[] = [];

    while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return dates;
}

export const exec_MI = async () => {
    let tickers = ['NVDA'];

    for(const ticker of tickers) {
        const share = await instrumentsService.get_share_by_ticker(ticker);

        let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_1_MIN;
        const from = moment("2022-09-26 13:00")//.add(3, 'hour').subtract(7, 'days');
        const to = moment("2022-09-26 23:45")//moment().add(3, 'hour')

        //console.log(from.toDate())
        //console.log(to.toDate())

        const candles_ = await get_historical_candles(
            ticker,
            from.toDate(),
            to.toDate(),
            tf_candle_interval
        );

        const candles = await prepare_candles(candles_, 0);


    }


}



export const exec_143 = async () => {
    // от старшего таймфtimeрейма к младшему
    const shares = await get_russian_shares(false);
    let tickers = shares.map((it) => { return it.ticker });//['YNDX', 'PIKK', 'LKOH']; // сюда добавляем тикеры из таблицы

    const default_period = 14; // последних значений (баров)

    const smoothing = Smoothing.EMA
    const atr = new ATR(default_period, smoothing); // SMMA WEMA
    const roc = new ROC(default_period); // SMMA WEMA
    const atr_factor = 3;

    const atrs: any[] = [];
    const rocs: any[] = [];
    const failed_tickers: any[] = [];

    let final_struct_0: Row0[] = [];


    // TODO: unary for DAY, Hour, and stream minutes

    const today = moment(moment().format('YYYY-MM-DD') + ' ' + '07:00').add(+3,'hours');
    const h_0959 = today.subtract(1, 'minute').format('YYYY-MM-DD hh:mm');
    const h_1001 = today.add(1, 'minute').format('YYYY-MM-DD hh:mm');

    for(const ticker of tickers) {
        //console.log('ticker = ' + ticker);

        const share = await instrumentsService.get_share_by_ticker(ticker);

        let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_15_MIN;
        const from = moment("2022-09-26 16:45")//.add(3, 'hour').subtract(7, 'days');

        //let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_5_MIN;
        //const from = moment().add(3, 'hour').subtract(2, 'day'); // 'week'
        const to = moment("2022-09-26 17:15")//moment().add(3, 'hour')

        //console.log(from.toDate())
        //console.log(to.toDate())

        const candles_ = await get_historical_candles(
            ticker,
            from.toDate(),
            to.toDate(),
            tf_candle_interval
        );

        const candles = await prepare_candles(candles_, 0);

        //console.log(candles)

        let atrs: number[] = [];
        let rocs: number[] = [];

        //console.log('ticker: ' + ticker);
        //console.log('candles len: ' + candles.length);

        if(candles.length > 0) {

        } else {
            failed_tickers.push(ticker)
            continue;
        }

        let row: Row0 = { t: ticker };

        //row.curr_price_h = +candles[candles.length - 1].close!.toFixed(2);


        let lowest = 1000000;
        let highest = 0;
        let time_low: any = '';
        let time_high: any = '';

        for(const c of candles) {
            if(c.low! <= lowest) {
                lowest = c.low!;
                time_low = c.time!;
            }

            if(c.high! >= highest) {
                highest = c.high!;
                time_high = c.time!;
            }
            //console.log(c)
            // const nv_atr = atr.nextValue(c.high!, c.low!, c.close!);
            // const nv_roc = roc.nextValue(c.close!);

            // const cond1 = moment(c.time!).isBetween('2022-09-18 17:59', '2022-09-18 18:01');
            // const cond2 = moment(c.time!).isBetween('2022-09-19 22:59', '2022-09-19 23:01');
            //
            // if(cond1 || cond2) {
            //     row.p_prev_day_close_h = +c.close!.toFixed(2);
            //     row.atr_prev_day_close_h = +nv_atr.toFixed(2);
            // }
            //
            // //console.log(h_0959)
            // console.log(c.time!)
            // console.log(moment(c.time!, 'YYYY-MM-DD hh:mm').subtract(3, 'hour'))
            //
            // await delay(6000000)
            //
            // if(moment(c.time!).subtract(3, 'hour').isBetween(h_0959, h_1001)) {
            //     row.p_curr_day_open_h = +c.high!.toFixed(2);
            //     row.atr_curr_day_open_h = +nv_atr.toFixed(2);
            // }

            // console.log(
            //     `${formatDT(c.time!)} : ${c.open} : ${c.high} : ${c.low} : ${c.close} : ${c.volume} : ` +
            //         `${nv_atr} : ${nv_roc}%`
            // )

            // atrs.push(nv_atr);
            // rocs.push(nv_roc);
        }

        row.lowest = lowest;
        row.highest = highest;

        row.percent = (row.highest / row.lowest - 1) * 100;

        row.time_low = time_low;
        row.time_high = time_high;

        //console.log(atrs)
        // const last_atr = atrs[atrs.length - 1];
        // const last_roc = rocs[rocs.length - 1];
        // //console.log(last_atr)
        // //console.log(last_roc)
        //
        // row.atr_curr_day_last_h = +last_atr.toFixed(2);
        // row.roc_curr_day_last_h = +last_roc.toFixed(2);
        // row.p = +(row.p_curr_day_open_h! / row.atr_curr_day_open_h!).toFixed(2)
        //
        // //console.log(row)
        //
        final_struct_0.push(row)
        //
        // atrs = [];
        // rocs = [];


    }


    final_struct_0.map((row: Row0) =>  {
        return {
            ...row,
            row
        }
    })

    //const sorted_map = final_struct.sort((a, b) => - a.atr_curr_day_open_h! + b.atr_curr_day_open_h!)
    const sorted_map = final_struct_0.sort((a, b) => b.percent! - a.percent!)
    //

    console.log(failed_tickers)
    console.table(sorted_map)
    // console.table(sorted_map.filter((it) => it.curr_price_h! <= 16999 && it.roc_curr_day_last_h! > -3.22 && it.roc_curr_day_last_h! < 10 ))
    // console.log(failed_tickers)

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


// TODO
// exec_143();
// дополнительно prev day = curr day %
// таблица ATR-ов