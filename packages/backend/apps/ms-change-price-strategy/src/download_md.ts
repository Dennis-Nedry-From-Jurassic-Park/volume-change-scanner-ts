import {get_russian_shares} from "../../ms-ti-base/api.ti.service.utils";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {downloadFile, getAppRootDir, syncAppendToFile} from "../../ms-base/src/utility-methods/file";
import secrets from "../../ms-base/src/utility-methods/env";
import path from "path";
import fs from "fs";
import {CandleInterval} from "tinkoff-invest-api/cjs/generated/marketdata";
import moment, {Moment} from "moment";
import assert from "assert";
import {get_historical_candles} from "../../ms-base/src/candles/candles";
import {prepare_candles} from "./tech.indicators";
import {prettyJSON} from "../../ms-ti-base/output";
import {convert_to_datetime, convert_to_timestamp} from "../../ms-base/src/datetime/dt";
import {delay} from "../../ms-ti-base/wait";
import {rootDir} from "../../ms-base/src/path/path";
import {insert_into_table_multiple} from "../../ms-base/src/db/generate-schema/own-clickhouse-generator-scheme";
import {toNum} from "../../ms-ti-base/number";

const number = require('extra-number');
let AdmZip = require("adm-zip");


export const exec = async () => {
    const config = {
        headers: {Authorization: `Bearer ${secrets.token!}`}
    };

    const year = 2022;
    const shares = await get_russian_shares();
    let ticks = shares.map((it) => {
        return it.ticker
    })
    console.log(ticks.length)
    let tickers = ticks;//['BABA', 'YNDX'];// 'YNDX', 'BABA', 'NVDA'  shares.map((it) => { return it.ticker });

    for (const ticker of tickers) {
        const share = await instrumentsService.get_share_by_ticker(ticker);

        await delay(5000)

        await downloadFile(
            `https://invest-public-api.tinkoff.ru/history-data?figi=${share.figi}&year=${year}`,
            getAppRootDir() + `/zip/${ticker}-${share.figi}-${year}.zip`, config.headers
        )
    }


}

const exec_mi = async () => {
    const dirpath = path.join(__dirname)

    const root = getAppRootDir()

    fs.readdir(root + `/zip/`, function (err, files) {
        const txtFiles = files.filter(el => path.extname(el) === '.zip')

        //console.log(txtFiles)
        let empty_zip_files: string[] = []
        let corrupted_zip_files: string[] = []

        let row_prepared: string = '';
        let counter: number = 0;
        txtFiles.forEach(file => {
            if (file.indexOf('-2022') > -1) { // вставка сначала только 2022 года
                // file.indexOf('_2019') > -1 || file.indexOf('_2020') > -1 || file.indexOf('_2021') > -1 ||
            } else {
                console.log('file = ' + file)
                return;
            }

            console.log(file)

            const file_ = root + '/zip/' + file

            let stats = fs.statSync(file_)
            let fileSizeInBytes = stats["size"]
            //console.log('fileSizeInBytes=' + fileSizeInBytes)

            if (fileSizeInBytes > 0) {
                // if(!isValidZipFile(file)){
                //
                //     corrupted_zip_files.push(file)
                //     return;
                // }

                /// ----------------------------------------------------------------   let row_prepared: string = '';

                let zip = new AdmZip(file_);
                let zipEntries = zip.getEntries();

                // const ticker_ = zipEntries

                zipEntries.forEach(function (zipEntry) {
                    //for (let i = 0; i < zipEntries.length; i++) {


                    //zipEntries.forEach(function (zipEntry) {

                    //for(let zipEntry of zipEntries) {
                    //console.log(zipEntry.toString()); // outputs zip entries information

                    const row: any = zipEntry.getData().toString("utf8");
                    //console.log(row)

                    //const row_splitted = row.split(";", 7);
                    const rows_splitted = row.split("\n");

                    //console.log(rows_splitted)

                    const isComplete = 1;
                    const tf = CandleInterval.CANDLE_INTERVAL_1_MIN;
                    //ticker;timestamp;open;close;high;low;volume
                    //for(let row of rows_splitted) { //

                    rows_splitted.forEach(function (row) {
                        const row_split = row.split(";", 7);
                        //console.log(row_split)
                        const figi = row_split[0];
                        const time = convert_to_timestamp(moment(row_split[1]))


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

                        row_prepared += ticker + ';' + figi + ';' + open + ';' + high + ';' + low + ';' + close + ';' + volume + ';' + time + ';' + +isComplete + ';' + tf + ';\n'
                        //+ row.replace(/(\r\n|\n|\r)/gm, "")
                        //console.log(row_prepared)
                        //assert(bool2 === '111', 'эропропр')
                    })


                    if (get_free_memory() < 500) {
                        counter += 1;
                        syncAppendToFile(root + '/zip_out/out_' + counter + '.csv', row_prepared);
                    }


                    //console.log(row_prepared)


                    //let bool = '1231'
                    //assert(bool === '111', 'эропропр')

                    //console.log(row);

                });


                // if (row_prepared.length > 2_500_000) {
                //     syncAppendToFile(root + '/zip_out/o_' + counter + '.csv', row_prepared);
                //     row_prepared = '';
                //     counter += 1;
                // }


                //console.log(prettyJSON(zipEntries))

            } else {
                empty_zip_files.push(file)
            }
        })
        //counter += 1;
        syncAppendToFile(root + '/zip_out/out_other.csv', row_prepared);

        console.log(empty_zip_files)

        // do something with your files, by the way they are just filenames...
    })
}

const exec_ = async () => {
    //const share = await instrumentsService.get_share_by_ticker(ticker);

    let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_1_MIN;
    const from = moment("2022-01-01T09:15:00Z")//.add(3, 'hour').subtract(7, 'days');

    //let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_5_MIN;
    //const from = moment().add(3, 'hour').subtract(2, 'day'); // 'week'
    const to = moment("2022-01-01T15:54:00Z").add(1, 'minute')//moment().add(3, 'hour')

    //console.log(from.toDate())
    //console.log(to.toDate())

    const candles_ = await get_historical_candles(
        'BABA',
        from.toDate(),
        to.toDate(),
        tf_candle_interval
    );

    //const candles = await prepare_candles(candles_, 0);

    console.log(candles_.candles.length)


}

const exec_ts = async () => {
    const timestamps = [
        1641028500,
        1641029100,
        1641029400,
        1641029520,
        1641029640
    ]

    // for(const ts of timestamps){
    //     const timestamp2 = moment(ts).format("X")
    //     //console.log()
    //     console.log(moment(ts).toISOString())
    // }

    const ts_ = moment("2022-01-01T09:25:00Z").valueOf()


    const ts = Math.floor(ts_ / 1e3)
    const ms = ts_ % 1e3

    //console.log(ts)
    //console.log(ms)

    //console.log(moment(ts).toISOString())
    //console.log(moment(ts * 1e3).toISOString())


    // const timestamp: number = +moment("2022-01-01T09:25:00Z").format("X")
    const a = convert_to_timestamp(moment("2022-01-01T09:25:00Z"))
    console.log(a)
    console.log(convert_to_datetime(a))
    // console.log(timestamp)
    //console.log(moment(timestamp * 1e3).utc())


    //
    //  const _ts_ = moment("2022-01-01T09:25:00Z").unix()//.format("X");
    //  //console.log(_ts_)
    //
    // // console.log(moment(_ts_).toISOString())
    //
    //
    //
    //
    //  const __ts = convert_to_timestamp(moment("2022-01-01T09:25:00.000Z"))
    //  console.log(__ts)
    //  //console.log(moment(__ts ).toISOString())
    //  console.log(convert_to_datetime(__ts ))
    // console.log(moment(__ts ).set('millisecond', 123).toISOString())

    // console.log(ts_);
    //  console.log(moment(ts_).format('YYYY-MM-DD hh:mm'));


}


//exec();
//exec_mi();


export const get_free_memory = (): number => {
    const os = require('os')
    const osFreeMem = os.freemem()
    const free_memory = (osFreeMem / (1024 * 1024))
    console.log(`Total free memory: ${free_memory}`)
    return free_memory
}


const get_last_day = async () => {
    const root = getAppRootDir()

    let hm: Map<string, Moment> = new Map<string, Moment>();

    const tf = CandleInterval.CANDLE_INTERVAL_1_MIN;

    fs.readdir(root + `/zip/`, async function (err, files) {
        const zipFiles = files.filter(el => path.extname(el) === '.zip')

        //console.log(txtFiles)
        let empty_zip_files: string[] = []
        let corrupted_zip_files: string[] = []

        let row_prepared: string = '';
        let counter: number = 0;

        let merged_all_candles: any[] = [];

        for (const file of zipFiles) {
            const ticker = file.substring(0, file.indexOf('-'));
            if(ticker !== 'KROT') continue;


            if (file.indexOf('-2022') > -1) { // вставка сначала только 2022 года
                // file.indexOf('_2019') > -1 || file.indexOf('_2020') > -1 || file.indexOf('_2021') > -1 ||
            } else {
                console.log('file = ' + file)
                continue;
            }

            //console.log(file)

            const file_ = root + '/zip/' + file

            let stats = fs.statSync(file_)
            let fileSizeInBytes = stats["size"]
            //console.log('fileSizeInBytes=' + fileSizeInBytes)

            if (fileSizeInBytes > 0) {
                // if(!isValidZipFile(file)){
                //
                //     corrupted_zip_files.push(file)
                //     return;
                // }

                /// ----------------------------------------------------------------   let row_prepared: string = '';

                let zip = new AdmZip(file_);
                let zipEntries = zip.getEntries();

                //console.log(zipEntries.at(-1).entryName)
                //console.log(zipEntries.at(-1).rawEntryName)
                //console.log(zipEntries.at(-1).name)
                
                const entryName = zipEntries.at(-1).entryName

                const last_day = entryName.substring(
                    entryName.indexOf("_") + 1,
                    entryName.lastIndexOf(".")
                );


                const from_ = moment(last_day).add(3, 'hours').utc()

                hm.set(ticker, from_)

                //const from = moment("2022-09-26 16:45")//.add(3, 'hour').subtract(7, 'days');

                //let tf_candle_interval = CandleInterval.CANDLE_INTERVAL_5_MIN;
                //const from = moment().add(3, 'hour').subtract(2, 'day'); // 'week'
                const to = moment('2022-09-29').utc()//moment().add(3, 'hour')

                console.log(ticker)
                //console.log(from_)
                //console.log(to)
                //console.log(getDatesListBetweenStartEndDatesAsDays(from_, to))

                for(const date of getDatesListBetweenStartEndDatesAsDays(from_, to)){
                    const from = date.add(0, 'day').add(0, 'second').toDate()
                    const to = date.add(1, 'day').subtract(1, 'second').toDate()
                    console.log(from)
                    console.log(to)

                    await delay(0)

                    const candles_ = await get_historical_candles(
                        ticker,
                        from,
                        to,
                        tf
                    );

                    //console.log(candles_)

                    if(candles_.candles.length === 0){
                        continue;
                    }

                    const share = await instrumentsService.get_share_by_ticker(ticker);

                    const candles = await prepare_candles(candles_, 0);
                    const merged = candles.map( (obj:any) => {


                        return {
                            ticker: share.ticker,
                            figi: share.figi,
                            open: obj.open ,
                            high: obj.high,
                            low: obj.low,
                            close: obj.close,
                            volume: obj.volume,
                            time: moment(obj.time).toISOString(),
                            isComplete: obj.isComplete,
                            tf: 1
                        }
                    });

                    console.log(merged)

                    //await delay(6000000)

                    merged_all_candles = [...merged_all_candles, ...merged]

                    //console.log(date)
                    //console.log(candles_)


                    //console.log(merged_all_candles)


                }


                //await delay(60000000)


                //console.log(from.toDate())
                //console.log(to.toDate())




            }
        }


        console.log(hm); // prettyJSON()

        const query = await insert_into_table_multiple('GetCandles', merged_all_candles)

        syncAppendToFile(rootDir + '\\_candles.json', prettyJSON(merged_all_candles))
        syncAppendToFile(rootDir + '\\_query.sql', prettyJSON(query))
        //console.log(merged_all_candles)

        // Далее обходим каждый тикер и мёржим свечи, полученные от Moment value до prev day

    });


    // (async() => {
    //     console.log(hm); // prettyJSON()
    // })


}


function getDatesListBetweenStartEndDatesAsDays(startDate, stopDate): Moment[] {
    let dates: any[] = []
    let dateObj = {};
    let currentDate = moment(startDate).add(1, 'day')
    stopDate = moment(stopDate);
    while (currentDate < stopDate) {
        dates.push(currentDate);
        dateObj[`${moment(currentDate).format('YYYY-MM-DD hh:mm')}`] = 0;
        currentDate = moment(currentDate).add(1, 'day');

    }

    return dates;
}


const exec__2 = async () => {
    let final_arr: number[] = []

    for (let i = 0; i < 3; i++){
        const arr = [i +1, i + 2]
        final_arr = [...final_arr, ...arr]
    }

    console.log(final_arr)

}
const exec__22= async () => {
    console.log(moment("2022-09-26T07:08:00.000Z").toDate());

    //await delay (4000000)

    const candles_ = await get_historical_candles(
        'KROT',
        moment("2022-09-26T07:07:00.000Z").toDate(),
        moment("2022-09-26T07:09:00.000Z").toDate(),
        CandleInterval.CANDLE_INTERVAL_1_MIN
    );

    const candles = await prepare_candles(candles_, 0);
    console.log(candles_)

}
const exec__ = async () => {
    const os = require('os')
    const osFreeMem = os.freemem()
    const allFreeMem = (osFreeMem / (1024 * 1024))
    console.log(`Total free memory: ${allFreeMem}`)

    const osTotalMem = os.totalmem()
    const avbMem = (osTotalMem / (1024 * 1024))
    console.log(`Total available RAM: ${avbMem}`)
}
//exec__22();
get_last_day();
//exec__2();