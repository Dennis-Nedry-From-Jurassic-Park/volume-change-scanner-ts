import assert from "node:assert/strict";
import {Share} from "tinkoff-invest-api/cjs/generated/instruments";
import {ACCOUNT} from "../ms-ti-base/users.service";
import {getPortfolioBalance} from "../ms-ti-base/operations.service";

enum RISK {
    PER_DEAL = 0.05,
    PER_DAY = 5, // PLTR + TSN + EAR + => NVAX?
}

export const assert_max_shares_per_deal = async (

) => {
    // TODO: например 0.5 * 100 good
    // TODO: 35 * 20 bad
}

export const assert_max_cash_per_deal = async (
    accountId: typeof ACCOUNT,
    share: Share,
    totalAmount: number
) => {
    assert(0.05 === RISK.PER_DEAL, 'RISK PER DEAL = 5 percent of deposit');
    const balance = await getPortfolioBalance(accountId, share.currency);
    const max_cash_per_deal = balance! * RISK.PER_DEAL;
    const msg = `\ntotalAmount > max_cash_per_deal.\n` +
        `info: totalAmount = ${totalAmount}; max_cash_per_deal = ${max_cash_per_deal}; RiskPercent = ${RISK.PER_DEAL};\n` +
        `${totalAmount} must be <= than ${max_cash_per_deal}`
    assert(totalAmount <= max_cash_per_deal, msg)
    console.log('max_cash_per_deal: ' + max_cash_per_deal)
    return max_cash_per_deal;
}

export const assert_max_deals_per_accont_per_day = async (
    accountId: typeof ACCOUNT,
    share: Share,
    totalAmount: number
) => {
    //asyncWriteFile('../../RisPerAccount.env', )
}