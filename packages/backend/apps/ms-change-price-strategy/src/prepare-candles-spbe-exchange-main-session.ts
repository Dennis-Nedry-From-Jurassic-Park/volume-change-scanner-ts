import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {prepare_candles} from "./prepare-candles";
import moment from "moment";
import {asyncWriteFile} from "../../ms-base/src/utility-methods/file";
import {prettyJSON} from "../../ms-ti-base/output";
import {tickers} from "../../ms-ti-base/tickers";
import assert from "assert";

const exec = async () => {
    console.log('start='+moment().toISOString())
    await prepare_candles(tickers);
    console.log('end='+moment().toISOString())
}

export const insert_candles_to_all_usa_shares_except_morning_session = async () => {
    console.log('start='+moment().toISOString())
    let tickers_10_00_main_session: string[] = require('../../../../../assets/ti-api-v2/tickers/spbe.10_00_main_session_500c.tickers.json');
    console.log(tickers_10_00_main_session.length)
    assert(tickers_10_00_main_session.length > 0, 'tickers_10_00_main_session len must be greater than zero, length of rows for insert statement')
    const all_usa_shares = await instrumentsService.get_all_american_shares();
    assert(all_usa_shares.length > 0, 'all_usa_shares len must be greater than zero, length of rows for insert statement')

    let all_usa_tickers: string[] = all_usa_shares.map(it => it.ticker)
    console.log(all_usa_tickers.length)
    let combined_tickers = all_usa_tickers.filter((item: string) => tickers_10_00_main_session.indexOf(item) < 0);
    console.log(combined_tickers.length)
    assert(combined_tickers.length > 0, 'tickers len must be greater than zero, length of rows for insert statement')
    //console.log(combined_tickers.length) // 1195
    //await asyncWriteFile('./combined_tickers.json', prettyJSON(combined_tickers))
    await prepare_candles(combined_tickers);
}

//console.log(moment())
//insert_candles_to_all_usa_shares_except_morning_session().then(() => console.log('end='+moment().toISOString()));



//exec()