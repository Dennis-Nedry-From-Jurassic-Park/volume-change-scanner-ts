import secrets from '../utility-methods/env';

export const getInvestmentsUserAccounts = async(sheet: string) => {
	const brokerAccountId = sheet === 'IIS'
		? secrets.brokerAccountIdIis : secrets.brokerAccountId;
	return brokerAccountId;
};
