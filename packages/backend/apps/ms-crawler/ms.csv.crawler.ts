import { prettyJSON } from "../ms-ti-base/output";
import {asyncWriteFile} from "../ms-base/src/utility-methods/file";
// scrap data with chrome plugin instant data scraper
const csvFilePath='./spbexchange_500c.csv'
const csv=require('csvtojson')

const exec = async () => {
    const jsonArray = await csv().fromFile(csvFilePath);
    const tickers = jsonArray.map((it:any) => { return it['tablescraper-selected-row 2'] } );
    console.log(tickers);
    await asyncWriteFile('../ms-crawler/spbe.10_00_main_session_500c.tickers.json', prettyJSON(tickers))
}

exec();
