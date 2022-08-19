import {prettyJSON} from "../ms-base/output";
const scraper = require('table-scraper');
scraper
    .get('https://highshortinterest.com/')
    .then(function(tableData:string) {
        //console.log(tableData)
        console.log(prettyJSON(tableData))
    });