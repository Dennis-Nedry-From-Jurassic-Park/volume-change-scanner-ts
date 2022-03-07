import 'dotenv/config';

const secrets = {
	sheet: process.env.SHEET,
	scopes: process.env.SCOPES,
	telegramToken: process.env.TELEGRAM_TOKEN,
	token: process.env.TOKEN,
	brokerAccountId: process.env.BROKER_ACCOUNT_ID,
	brokerAccountIdIis: process.env.BROKER_ACCOUNT_ID_IIS,
};

export default secrets;
