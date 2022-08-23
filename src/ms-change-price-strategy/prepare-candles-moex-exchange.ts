import {instrumentsService} from "../ms-ti-base/instruments.service";
import {Share} from "tinkoff-invest-api/cjs/generated/instruments";
import assert from "assert";
import {prepare_candles} from "./prepare-candles";

import pRetry from "p-retry";

export const prepare_candles_moex_exchange = async () => {
    // const result = await pRetry(async () => console.log(111), {
    //     onFailedAttempt: error => {
    //         console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
    //     },
    //     retries: 3
    // });
    //
    // console.log(result);

    const rus_shares = await instrumentsService.get_all_russian_shares();
    const tickers = rus_shares.map((it:Share) => { return it.ticker } )
    const figies = await instrumentsService.get_figies_by_tickers(tickers);

    assert(tickers.length === figies.length, `tickers length ${tickers.length} !== figies length ${figies.length}`)

    await prepare_candles(tickers);
}
prepare_candles_moex_exchange();