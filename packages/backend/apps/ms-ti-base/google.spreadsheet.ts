import secrets from "../ms-base/src/utility-methods/env";

export const DIVIDENDS_SHEET: any = {
    IIS_B2: secrets.googleSpreadsheetIisB2,
    BROKERAGE_B2: secrets.googleSpreadsheetIisB2,
}

export const getInvestmentsUserAccounts = async(sheet: string) => {
    const brokerAccountId = sheet === 'IIS'
        ? secrets.brokerAccountIdIis : secrets.brokerAccountId;
    return brokerAccountId;
};