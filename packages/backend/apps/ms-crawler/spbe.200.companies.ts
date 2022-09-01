import {asyncWriteFile} from "../ms-base/src/utility-methods/file";
import {prettyJSON} from "../ms-ti-base/output";

const scraper = require('table-scraper');


type elem = {
    [key: string]: string
}

let arr: any[] = [];

function createStringArray(arr:any, prop:any) {
    let result: any[] = [];
    for (let i = 0; i < arr.length; i += 1) {
        result.push(arr[i][prop]);
    }
    return result;
}

scraper
    .get('https://spbexchange.ru/ru/stocks/10_00_main_session/')
    .then(function(tableData:string) {
        //console.log(tableData)
        console.log(prettyJSON(tableData))

        asyncWriteFile('../../tabledata2.json', prettyJSON(tableData))

        // for (let obj in tableData) {
        //     if (obj.hasOwnProperty('Идентификационный код ценной бумаги')) {
        //         arr.push(tableData['Идентификационный код ценной бумаги']);
        //     }
        // }


        //const an=tableData.map(function(td:any) { return td['№'] })
        //console.log(arr)
       // console.log(createStringArray(tableData, 'Идентификационный код ценной бумаги'))



        // tableData.forEach(function(row:any) {
        //     console.log(row['№'])
        // })
        /*
           tableData ===
            [
              [
                { State: 'Minnesota', 'Capital City': 'Saint Paul', 'Pop.': '3' },
                { State: 'New York', 'Capital City': 'Albany', 'Pop.': 'Eight Million' }
              ]
            ]
        */
    });