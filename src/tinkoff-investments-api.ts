const OpenAPI = require ('@tinkoff/invest-openapi-js-sdk');

import secrets from './utility-methods/env';

const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const apiURL = "https://api-invest.tinkoff.ru/openapi";
const secretToken = secrets.secretToken;

export default class TinkoffInvestmentsApi {
    public api: any;

    constructor(brokerAccountId:string) {
        this.api = new OpenAPI({
            apiURL,
            secretToken,
            socketURL,
            brokerAccountId
        });
    }
}