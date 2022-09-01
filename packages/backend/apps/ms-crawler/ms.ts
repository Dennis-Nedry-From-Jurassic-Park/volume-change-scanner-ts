import {asyncWriteFile} from "../ms-base/src/utility-methods/file";

const tabletojson = require('tabletojson').Tabletojson;

tabletojson.convertUrl(
    'https://spbexchange.ru/ru/stocks/10_00_main_session/',
    async function (tablesAsJson: any[]) {
        console.log(tablesAsJson[1]);
        await asyncWriteFile('../../table350.json', tablesAsJson[1]);
    }
);