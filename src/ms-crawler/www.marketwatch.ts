import {prettyJSON} from "../ms-base/output";
const scraper = require('table-scraper');
// scraper
//     .get('https://www.marketwatch.com/tools/screener/short-interest/')
//     .then(function(tableData:string) {
//         //console.log(tableData)
//         console.log(prettyJSON(tableData))
//     });
scraper
    .get('https://www.nasdaq.com/market-activity/pre-market/')
    .then(function(tableData:string) {
        //console.log(tableData)
        console.log(prettyJSON(tableData))
    });