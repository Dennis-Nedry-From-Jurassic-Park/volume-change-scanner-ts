import secrets from '../utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import moment from 'moment';

const finnhubKeyApi = secrets.finnhubKeyApi!;

const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnhubKeyApi

export const pharma_report_calendar = async () => {
    const finnhubClient = new finnhub.DefaultApi()

    //const today = '2022-08-13'
    const today = '2022-08-04'
    const prev = moment(today).subtract(1, "days").format("YYYY-MM-DD");
    // const prev = moment(today).subtract(7, "days").format("YYYY-MM-DD");
    //  const day = today;
    const day = today;

    finnhubClient.fdaCommitteeMeetingCalendar((error: any, data: any, response: any) => {
        console.log(data)
    });
}

pharma_report_calendar();