import {instrumentsService} from "../ms-ti-base/instruments.service";
import {prepare_candles} from "./prepare-candles";

export const insert_candles_to_all_usa_shares_except_morning_session = async () => {
    let tickers_10_00_main_session: string[] = require('../../../../assets/ti-api-v2/tickers/spbe.10_00_main_session_500c.tickers.json');
    const all_usa_shares = await instrumentsService.get_all_american_shares();
    let all_usa_tickers: string[] = all_usa_shares.map(it => it.ticker)
    let combined_tickers = all_usa_tickers.filter((item: string) => tickers_10_00_main_session.indexOf(item) < 0);
    await prepare_candles(combined_tickers);
}
insert_candles_to_all_usa_shares_except_morning_session();