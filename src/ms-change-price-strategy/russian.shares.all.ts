import {Share} from "tinkoff-invest-api/cjs/generated/instruments";

import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import {get_price_change} from "./common";
import {Exchange} from "../constants/exchange";
import {delay} from "../ms-ti-base/wait";
import {instrumentsService} from "../ms-ti-base/instruments.service";

export const price_change_rus_shares = async () => {
    const rus_shares = await instrumentsService.get_all_russian_shares();
    const tickers = rus_shares.map((it:Share) => { return it.ticker } )
        //const tickers = instrumentsService.get_tickers()
    await get_price_change(Exchange.MOEX, tickers, CandleInterval.CANDLE_INTERVAL_DAY);
}

price_change_rus_shares()
    .then(() => console.log('get price changes for russian shares with apiTradeAvailableFlag (=false|true)'));

delay(2500).then(() => console.log('delay between runs get price changes for russian shares'))

//price_change_rus_shares(true)
//    .then(() => console.log('get price changes for russian shares with apiTradeAvailableFlag (=true)'));
