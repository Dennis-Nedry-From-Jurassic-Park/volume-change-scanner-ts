import secrets from '../utility-methods/env';

import moment from 'moment';

const token = secrets.token!;
const finnhubKeyApi = secrets.finnhubKeyApi!;

const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnhubKeyApi

export const market_news = async () => {
    const finnhubClient = new finnhub.DefaultApi()

    const today = '2022-08-04'
    const prev = moment(today).subtract(1, "days").format("YYYY-MM-DD");
    // const prev = moment(today).subtract(7, "days").format("YYYY-MM-DD");
    //  const day = today;
    const day = today;

    finnhubClient.marketNews("general", {}, (error:any, data:any, response:any) => {
        console.log(data)
    });
}

market_news();