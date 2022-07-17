import 'dotenv/config';
//require('dotenv').config({ path: './.env' });

const secrets = {
	sheet: process.env.SHEET as string,
	scopes: process.env.SCOPES as string,
	telegramToken: process.env.TELEGRAM_TOKEN as string,
	token: process.env.TOKEN as string,
	brokerAccountId: process.env.BROKER_ACCOUNT_ID as string,
	brokerAccountIdIis: process.env.BROKER_ACCOUNT_ID_IIS as string,
};

export default secrets;
