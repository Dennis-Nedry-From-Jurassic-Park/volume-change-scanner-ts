import {ACCOUNT} from "./users.service";
import {api} from "./api";
import {MoneyValue} from "tinkoff-invest-api/cjs/generated/common";
import {toNum} from "./number";

export const getPortfolioBalance = async (accountId: typeof ACCOUNT, currency: string): Promise<number | undefined> => {
    const positions = await api.operations.getPositions({ accountId: accountId});
    const balance = positions.money.filter( (balance: MoneyValue) => { return balance.currency === currency })[0];
    console.log('balance: ' + balance);
    return toNum(balance);
}