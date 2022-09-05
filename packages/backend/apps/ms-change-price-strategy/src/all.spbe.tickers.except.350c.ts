import moment from "moment";
import {instrumentsService} from "../../ms-ti-base/instruments.service";

const exec = async () => {
    let tickers_10_00_main_session: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
    const all_usa_shares = await instrumentsService.get_all_american_shares();
    let all_usa_tickers: string[] = all_usa_shares.map(it => it.ticker)
    let combined_tickers = all_usa_tickers.filter((item: string) => tickers_10_00_main_session.indexOf(item) < 0);
    console.log(combined_tickers.length);
    console.log(moment().toISOString())
}

exec()