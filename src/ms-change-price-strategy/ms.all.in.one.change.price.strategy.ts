import {get_price_change} from "./common";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {Exchange} from "../constants/exchange";
import {delay} from "../ms-ti-base/wait";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {price_change_rus_shares} from "./russian.shares.all";

const get_change_price_for_all_usa_shares_except_morning_session = async () => {
    let tickers_10_00_main_session: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
    const all_usa_shares = await instrumentsService.get_all_american_shares();
    let all_usa_tickers: string[] = all_usa_shares.map(it => it.ticker)
    let combined_tickers = all_usa_tickers.filter((item: string) => tickers_10_00_main_session.indexOf(item) < 0);
    await get_price_change(Exchange.SPB, combined_tickers, CandleInterval.CANDLE_INTERVAL_DAY);
}

const exec = async () => {
    await get_change_price_for_all_usa_shares_except_morning_session()
        .then(() => console.log('ms get-price-change runned for all_usa_shares_except_morning_session'))

    await delay(2500).then(() => console.log('delay between runs get price changes for different groups of shares'))

    console.log(moment().toISOString())

    const tickers_10_00_main_session: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
    await get_price_change(Exchange.SPB, tickers_10_00_main_session, CandleInterval.CANDLE_INTERVAL_DAY)
        .then(() => 'ms get-price-change runned for tickers_10_00_main_session');

    await delay(5000).then(() => console.log('delay between runs get price changes for russian shares'))

    console.log(moment().toISOString())

    await price_change_rus_shares()
        .then(() => console.log('get price changes for russian shares'));
}

exec();


