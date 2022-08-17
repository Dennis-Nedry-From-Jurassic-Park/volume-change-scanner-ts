import {asyncWriteFile} from "../utility-methods/file";
import {prettyJSON} from '../api.ti.service.utils';

const csvFilePath='./spbexchange.csv'
const csv=require('csvtojson')

const exec = async () => {
    const jsonArray = await csv().fromFile(csvFilePath);
    const tickers = jsonArray.map((it:any) => { return it['tablescraper-selected-row 2'] } );
    console.log(tickers);
    await asyncWriteFile('../ms-crawler/spbe.10_00_main_session.tickers.json', prettyJSON(tickers))
}

exec();