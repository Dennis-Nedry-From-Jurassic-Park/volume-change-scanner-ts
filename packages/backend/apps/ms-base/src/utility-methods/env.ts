const path = require('path')

import * as dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../../../../../../.env'), debug: true });

//
// require('dotenv').config({ path: path.resolve(__dirname, '../../../../../.env') });
// require('dotenv').load()

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

	redisHost: process.env.REDIS_HOST,
	redisPort: process.env.REDIS_PORT,
	redisPassword: process.env.REDIS_PASSWORD

};

export default secrets;
