import secrets from '../utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import moment from 'moment';
import {instrumentsService} from "../ms-ti-base/instruments.service";

const token = secrets.token!;
const finnhubKeyApi = secrets.finnhubKeyApi!;

const api = new TinkoffInvestApi({token: token});

const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnhubKeyApi


export const report_calendar = async () => {
    const finnhubClient = new finnhub.DefaultApi()

    //const today = '2022-08-13'
    const today = '2022-08-08'
    const prev = moment(today).subtract(1, "days").format("YYYY-MM-DD");
    // const prev = moment(today).subtract(7, "days").format("YYYY-MM-DD");
    //  const day = today;
    const day = today;

    finnhubClient.earningsCalendar({"from": day, "to": day}, async (error: any, data: any, response: any) => {
        const report_calendar_tickers = data.earningsCalendar.filter((earn: any) => {
            return earn.symbol !== 'DDOG'
        })

        const tickers: any[] = []; // TODO //await instrumentsService.get_all_tickers();

        const filtered = report_calendar_tickers.filter((obj: any) => tickers.includes(obj.symbol));
        // https://www.tinkoff.ru/invest/social/profile/Marketon/598cf0ca-e967-413a-9157-e178f5388e5b/
        // https://stackoverflow.com/questions/47443262/how-do-i-filter-a-typescript-array-with-items-in-another-array
        //console.log(filtered)

        //await asyncWriteFile('../report.from.' + prev + '.to.' + day + '.json', JSON.stringify(filtered));

        //console.log('-------------------------------------------')
        //console.log(filtered.filter((obj:any) =>  { return obj.epsActual !== null && obj.revenueActual !== null}))
        //console.log('-------------------------------------------')
        //console.log(filtered.filter((obj:any) =>  { return obj.epsActual === null && obj.revenueActual === null && obj.hour === 'bmo'}))
        console.log(filtered.filter((obj: any) => {
            //return obj.hour === 'bmo' && obj.epsActual !== null && obj.revenueActual !== null
            //return obj.hour === 'amc'
            //return obj.hour === 'bmo' && obj.epsEstimate > 2 && obj.epsActual !== null && obj.revenueActual !== null
            return obj.hour === 'amc'// && obj.epsActual !== null && obj.revenueActual !== null
        })) // obj.hour === 'bmo' &&
        // && obj.epsActual !== null && obj.revenueActual !== null
    });
}

report_calendar();


function getDates(startDate: any, endDate: any) {
    const dates: any[] = []
    const addDays = function (days: any) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    let currentDate: any = addDays.call(startDate, 1)

    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }
    return dates
}

// Usage
// const dates = getDates(new Date(2022, 7, 1), new Date(2022, 7, 5));
// dates.forEach(function (date:any) {
//   console.log(date)
// })


let dates2 = ['2022-07-01', '2022-07-05', '2022-07-14']


//get_gap_dates(['2022-07-01', '2022-07-05', '2022-07-09'])