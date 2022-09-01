import { prettyJSON } from "../ms-ti-base/output";
import {asyncWriteFile} from "../ms-base/src/utility-methods/file";
const scraper = require('table-scraper');

// scraper
//     .get('https://www.nasdaq.com/market-activity/pre-market')
//     .then(function(tableData:string) {
//         //console.log(tableData)
//         console.log(prettyJSON(tableData))
//
//         asyncWriteFile('../../nasdaq.json', prettyJSON(tableData))
//
//     });
