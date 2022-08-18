import 'dotenv/config';

const secrets = {
	sheet: process.env.SHEET,
	scopes: process.env.SCOPES,
	telegramToken: process.env.TELEGRAM_TOKEN,
	telegramInvestingBotId: process.env.TELEGRAM_INVESTING_BOT_ID,
	token: process.env.TOKEN,
	brokerAccountId: process.env.BROKER_ACCOUNT_ID_BROKERAGE,
	brokerAccountIdIis: process.env.BROKER_ACCOUNT_ID_IIS,
	googleSpreadsheetIisB2: process.env.IIS_B2,
	googleSpreadsheetBrokerageB2: process.env.BROKERAGE_B2,
	finnhubKeyApi: process.env.FINNHUB_KEY_API,
};

export default secrets;
