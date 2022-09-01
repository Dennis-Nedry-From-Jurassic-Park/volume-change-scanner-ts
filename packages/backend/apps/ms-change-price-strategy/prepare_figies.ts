import {instrumentsService} from "../ms-ti-base/instruments.service";
import {asyncWriteFile} from "../ms-base/src/utility-methods/file";

const prepare_figies = async () => {
    //let tickers_10_00_main_session: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
    //const all_usa_shares = await instrumentsService.get_all_american_shares();
    //let all_usa_figies: string[] = all_usa_shares.map(it => it.figi)
    //const data = all_usa_figies.join('\n')

    //const figies = await instrumentsService.get_figies_by_tickers(tickers_10_00_main_session)
    //const data = figies.join('\n')

    //await asyncWriteFile('../../350c.figies.txt', data)

    //let tickers: string[] = require('../ms-crawler/spbe.10_00_main_session.tickers.json');
    const shares = await instrumentsService.get_all_russian_shares()
    const figies = shares.map(it => it.figi)
    const data = figies.join('\n')

    await asyncWriteFile('../../all.russian.companies.figies.txt', data)
}

prepare_figies();