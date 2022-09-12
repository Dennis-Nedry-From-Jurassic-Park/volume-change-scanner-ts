import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {Share} from "tinkoff-invest-api/cjs/generated/instruments";
import assert from "assert";
import {prepare_candles} from "./prepare-candles";

export const prepare_candles_moex_exchange = async () => {
    const rus_shares = await instrumentsService.get_all_russian_shares();
    const tickers = rus_shares.map((it:Share) => { return it.ticker } )
    const figies = await instrumentsService.get_figies_by_tickers(tickers);

    assert(tickers.length === figies.length, `tickers length ${tickers.length} !== figies length ${figies.length}`)

    await prepare_candles(tickers);
}