import {TinkoffInvestApi} from "tinkoff-invest-api";
import {MarketDataResponse} from "tinkoff-invest-api/cjs/generated/marketdata";

export const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

export async function waitMarketStreamEvent(api: TinkoffInvestApi, event: 'data' | 'close') {
    return new Promise<MarketDataResponse>(resolve => api.stream.market.on(event, resolve));
}