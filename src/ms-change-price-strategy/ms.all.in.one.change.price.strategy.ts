import {get_price_change} from "./common";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment from "moment";
import {Exchange} from "../constants/exchange";
import {delay} from "../ms-base/wait";

console.log(moment().toISOString())

const tickers_10_00_main_session: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
get_price_change(Exchange.SPB, tickers_10_00_main_session, CandleInterval.CANDLE_INTERVAL_DAY)
    .then(() => 'ms get-price-change runned for tickers_10_00_main_session');

delay(2500).then(() => console.log('delay between runs get price changes for russian shares'))

//price_change_rus_shares()
 //   .then(() => console.log('get price changes for russian shares without apiTradeAvailableFlag (=false)'));

//delay(2500).then(() => console.log('delay between runs get price changes for russian shares'))

//price_change_rus_shares(true)
//    .then(() => console.log('get price changes for russian shares with apiTradeAvailableFlag (=true)'));

console.log(moment().toISOString())
