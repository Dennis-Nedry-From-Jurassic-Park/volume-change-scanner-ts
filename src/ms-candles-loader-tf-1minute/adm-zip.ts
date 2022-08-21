import assert from "assert";
import {instrumentsService} from "../ms-ti-base/instruments.service";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import {syncAppendToFile} from "../utility-methods/file";
import moment from "moment";

let AdmZip = require("adm-zip");

const path = require('path')
const fs = require('fs')

const number = require('extra-number');

const exec = async () => {
    const dirpath = path.join(__dirname)

    fs.readdir(dirpath, function (err, files) {
        const txtFiles = files.filter(el => path.extname(el) === '.zip')
        let empty_zip_files: string[] = []
        let corrupted_zip_files: string[] = []

        let row_prepared: string = '';
        let counter: number = 0;
        txtFiles.forEach(file => {
            //if(theFileName.indexOf('myfilethree') > -1)

            // console.log(file.indexOf('_2019'))
            // console.log(file.indexOf('_2020'))
            // console.log(file.indexOf('_2021'))
            // console.log(file.indexOf('_2022'))
            if(file.indexOf('_2022') > -1){ // вставка сначала только 2022 года
                // file.indexOf('_2019') > -1 || file.indexOf('_2020') > -1 || file.indexOf('_2021') > -1 ||
            } else {
                console.log('file = ' + file)
                return;
            }

            console.log(file)

            let stats = fs.statSync(file)
            let fileSizeInBytes = stats["size"]
            //console.log('fileSizeInBytes=' + fileSizeInBytes)

            if (fileSizeInBytes > 0) {
                // if(!isValidZipFile(file)){
                //
                //     corrupted_zip_files.push(file)
                //     return;
                // }

 /// ----------------------------------------------------------------   let row_prepared: string = '';

                let zip = new AdmZip(file);
                let zipEntries = zip.getEntries();

                zipEntries.forEach(function (zipEntry) {

                //for(let zipEntry of zipEntries) {
                    //console.log(zipEntry.toString()); // outputs zip entries information

                    const row: any = zipEntry.getData().toString("utf8");

                    //const row_splitted = row.split(";", 7);
                    const rows_splitted = row.split("\n");
                    //console.log(rows_splitted)

                    const isComplete = 1;
                    const tf = CandleInterval.CANDLE_INTERVAL_1_MIN;
                    //ticker;timestamp;open;close;high;low;volume
                    rows_splitted.forEach(function (row) {
                        const row_split = row.split(";", 7);
                        //console.log(row_split)
                        const figi = row_split[0];
                        const time = moment(row_split[1]).unix();

                        //console.log(time)
                        //let bool2 = '1231'

                        const open = row_split[2] as number;
                        const close = row_split[3] as number;
                        const high = row_split[4] as number;
                        const low = row_split[5] as number;
                        const volume = row_split[6] as number;
                        if (figi === '') return;

                        const share = instrumentsService.get_share_by_figi_sync(figi);

                        const ticker = share.ticker;


                        // BBG000B9XRY4_2020.zip
                        // AssertionError [ERR_ASSERTION]: high must be >= low for ticker AAPL (figi=BBG000B9XRY4) 2020-07-30T20:30:00Z 100.69 97.4
                        // 6

                        //console.log(row_split)

                        assert(number.compare(high, low) >= 0, 'high must be >= low for ticker ' + ticker + ' ' + time)
                        assert(number.compare(high, close) >= 0, 'high must be >= close for ticker ' + ticker + ' ' + time)
                        assert(number.compare(high, open) >= 0, 'high must be >= open for ticker ' + ticker + ' ' + time)

                        assert(number.compare(close, low) >= 0, 'close must be >= low for ticker ' + ticker + ' ' + time)
                        assert(number.compare(open, low) >= 0, 'open must be >= low for ticker ' + ticker + ' ' + time)
                        /*
                        assert(high >= low, 'high must be >= low for ticker ' + ticker + ' (figi=' + figi + ') ' + time + ' ' + high + ' ' + low + ' '
                            + volume + '\n' + row_split + '\n' + high + '\n' + low)
                        assert(high >= close, 'high must be >= close for ticker ' + ticker + ' (figi=' + figi + ')' + time + ')')
                        assert(high >= open, 'high must be >= open for ticker ' + ticker + ' (figi=' + figi + ') ' + time + ')')

                        assert(close >= low, 'close must be >= low for ticker ' + ticker + ' (figi=' + figi + ') ' + time + ')')
                        assert(open >= low, 'close must be >= low for ticker ' + ticker + ' (figi=' + figi + ') ' + time + ')')
*/

                        row_prepared += ticker+';'+figi+';' + open + ';' + high + ';' + low + ';' + close + ';' + volume + ';' + time + ';' +  + isComplete + ';' + tf + ';\n'
                            //+ row.replace(/(\r\n|\n|\r)/gm, "")
                        //console.log(row_prepared)
                        //assert(bool2 === '111', 'эропропр')
                    })


                    //console.log(row_prepared)


                    //let bool = '1231'
                    //assert(bool === '111', 'эропропр')

                    //console.log(row);

                });


                if(row_prepared.length > 2_500_000) {
                    syncAppendToFile('../../output-'+counter+'.csv', row_prepared);
                    row_prepared = '';
                    counter += 1;
                }




                //console.log(prettyJSON(zipEntries))

            } else {
                empty_zip_files.push(file)
            }
        })
        //counter += 1;
        syncAppendToFile('../../output-another.csv', row_prepared);

        console.log(empty_zip_files)

        // do something with your files, by the way they are just filenames...
    })
}


exec();
// function count(c:string ) {
//     let result = 0, i = 0;
//     for(i;i<this.length;i++)if(this[i]==c)result++;
//     return result;
// }

//let moment2 = require('moment-timezone');
//const date = moment2().tz('2022-01-23T14:30:00Z', "Europe/Moscow");
//const mo = moment('2018-01-23T14:30:00Z').add(3, 'hour').unix()

// const mo2 = moment('2018-01-23T14:30:00Z', 'YYYY-MM-DD hh:mm:ss')
// const mo3 =  moment('2018-01-23T14:30:00Z').format('YYYY-MM-DD hh:mm:ss')
//const m43 =  moment('2022-01-23T14:30:00Z').format('YYYY-MM-DD hh:mm:ss')
//console.log(mo3)
//console.log(date.date(10).unix())
    //console.log(mo)
//console.log(mo)
//console.log(mo2.toISOString())



/*


// reading archives
let zip = new AdmZip("./my_file.zip");
let zipEntries = zip.getEntries(); // an array of ZipEntry records

zipEntries.forEach(function (zipEntry) {
    console.log(zipEntry.toString()); // outputs zip entries information
    if (zipEntry.entryName == "my_file.txt") {
        console.log(zipEntry.getData().toString("utf8"));
    }
});*/