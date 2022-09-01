import {prettyJSON} from "../ms-ti-base/output";

const scraper = require('table-scraper');
scraper
    .get('https://www.pennystockflow.com/')
    .then(function(tableData:string) {
        //console.log(tableData)
        console.log(prettyJSON(tableData))
    });