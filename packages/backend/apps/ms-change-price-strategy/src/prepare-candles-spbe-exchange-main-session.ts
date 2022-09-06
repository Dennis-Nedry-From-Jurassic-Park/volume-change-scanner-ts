import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {prepare_candles} from "./prepare-candles";
import moment from "moment";
import {asyncWriteFile} from "../../ms-base/src/utility-methods/file";
import {prettyJSON} from "../../ms-ti-base/output";

export const insert_candles_to_all_usa_shares_except_morning_session = async () => {
    console.log('start='+moment().toISOString())
    let tickers_10_00_main_session: string[] = require('../../../../../assets/ti-api-v2/tickers/spbe.10_00_main_session_500c.tickers.json');
    const all_usa_shares = await instrumentsService.get_all_american_shares();
    let all_usa_tickers: string[] = all_usa_shares.map(it => it.ticker)
    let combined_tickers = all_usa_tickers.filter((item: string) => tickers_10_00_main_session.indexOf(item) < 0);
    //console.log(combined_tickers.length) // 1195
    //await asyncWriteFile('./combined_tickers.json', prettyJSON(combined_tickers))
    await prepare_candles(combined_tickers);
}
console.log(moment())
//insert_candles_to_all_usa_shares_except_morning_session().then(() => console.log('end='+moment().toISOString()));

import {tickers} from "../../ms-ti-base/tickers";

const exec = async () => {
    console.log('start='+moment().toISOString())
    await prepare_candles(tickers);
    console.log('end='+moment().toISOString())
}

exec()