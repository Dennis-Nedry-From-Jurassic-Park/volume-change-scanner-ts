import {get_price_change} from "./common";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {Exchange} from "../../ms-base/src/constants/exchange";
import {delay} from "../../ms-ti-base/wait";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {price_change_rus_shares} from "./russian.shares.all";
import {getAppRootDir} from "../../ms-base/src/utility-methods/file";
import {insert_candles_to_all_usa_shares_except_morning_session} from "./prepare-candles-spbe-exchange-main-session";
import {prepare_candles_moex_exchange} from "./prepare-candles-moex-exchange";
import {rootDir} from "../../ms-base/src/path/path";

const get_change_price_for_all_usa_shares_except_morning_session = async () => {
    let tickers_10_00_main_session: string[] = require(getAppRootDir()+'\\assets\\ti-api-v2\\spbe\\spbe.10_00_main_session.tickers.json');
    const all_usa_shares = await instrumentsService.get_all_american_shares();
    let all_usa_tickers: string[] = all_usa_shares.map(it => it.ticker)
    let combined_tickers = all_usa_tickers.filter((item: string) => tickers_10_00_main_session.indexOf(item) < 0);
    await get_price_change(Exchange.SPB, combined_tickers, CandleInterval.CANDLE_INTERVAL_DAY);
}

const exec2 = async () => {
    await prepare_candles_moex_exchange();
}
const exec = async () => {
    //await insert_candles_to_all_usa_shares_except_morning_session()
    //    .then(() => console.log('ms get-price-change runned for all_usa_shares_except_morning_session'))
    //
    await get_change_price_for_all_usa_shares_except_morning_session()
        .then(() => console.log('ms get-price-change runned for all_usa_shares_except_morning_session'))

    //await delay(2500).then(() => console.log('delay between runs get price changes for different groups of shares'))
    //
    // console.log(moment().toISOString())





   // let tickers_10_00_main_session: string[] = require(getAppRootDir()+'\\assets\\ti-api-v2\\spbe\\spbe.10_00_main_session.tickers.json');

    //await get_price_change(Exchange.SPB, tickers_10_00_main_session, CandleInterval.CANDLE_INTERVAL_DAY)
    //    .then(() => 'ms get-price-change runned for tickers_10_00_main_session');

   // await delay(1000).then(() => console.log('delay between runs get price changes for russian shares'))





   console.log(moment().toISOString())

   await price_change_rus_shares()
       .then(() => console.log('get price changes for russian shares'));
}



const exec_while_stop = async () => {
    while (true) {
        // await delay (0);
        // let tickers_10_00_morning_session: string[] = require(rootDir + '\\assets\\ti-api-v2\\spbe\\spbe.10_00_main_session.tickers.json');
        // await get_price_change(Exchange.SPB, tickers_10_00_morning_session, CandleInterval.CANDLE_INTERVAL_DAY)
        //     .then(() => 'ms get-price-change running for tickers_10_00_morning_session');
        // await delay (1000);
        // await get_change_price_for_all_usa_shares_except_morning_session()
        //     .then(() => console.log('ms get-price-change running for all_usa_shares_except_morning_session'))
        // await delay (1000);
        await price_change_rus_shares()
            .then(() => console.log('get price changes for russian shares'));

        await delay (60000);
    }
}


//exec();
exec_while_stop();
