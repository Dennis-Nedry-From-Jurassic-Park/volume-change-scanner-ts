import secrets from './utility-methods/env';

import { investing } from "investing-com-api";
import moment from "moment";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import { Share } from "tinkoff-invest-api/cjs/generated/instruments";
import { MarketDataResponse } from "tinkoff-invest-api/cjs/generated/marketdata";

export const ACCOUNT: any = {
    IIS: secrets.brokerAccountIdIis,
    BROKERAGE: secrets.brokerAccountId,
}

export const DIVIDENDS_SHEET: any = {
    IIS_B2: secrets.googleSpreadsheetIisB2,
    BROKERAGE_B2: secrets.googleSpreadsheetIisB2,
}

export enum MARKET_DEPTH {
    D1 = 1,
    D10 = 10,
    D20 = 20,
    D30 = 30,
    D40 = 40,
    D50 = 50,
}

export interface Moex {
    dateTime: string,
    imoex: number,
}

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export const get_MOEX_index = async (): Promise<Moex> => {
    let response = await investing('indices/mcx', 'P1D', 'PT1M');
    response.sort((a:any, b:any) => b.date - a.date)

    const dt = moment(response[0].date).format('DD.MM.YYYY HH:mm');
    const imoex = response[0].value;

    const moex: Moex = {
        dateTime: dt,
        imoex: imoex
    };
    
    console.log(moex.dateTime + ' : ' +  moex.imoex);

    return moex;
}

export const get_share_by_ticker = async (ticker:string): Promise<Share> => {
    const shares: Share[] = require('../combined_shares.json');

    const share = shares.filter( (s:any) => { return s.ticker === ticker })[0];

    return share;
}
export const get_share_by_isin = async (isin:string): Promise<Share> => {
    const shares: Share[] = require('../combined_shares.json');

    const share = shares.filter( (s:any) => { return s.isin === isin })[0];

    return share;
}

export async function waitMarketStreamEvent(api: TinkoffInvestApi, event: 'data' | 'close') {
    return new Promise<MarketDataResponse>(resolve => api.stream.market.on(event, resolve));
}

