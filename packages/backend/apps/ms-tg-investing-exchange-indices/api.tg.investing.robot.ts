import secrets from '../ms-base/src/utility-methods/env';

import bot from '../ms-base/src/telegram/bot'
import {get_index} from "../ms-ti-base/indexes";
import {IndexInvesting} from "../ms-ti-base/indexes";

export const exec_investing_robot = async () => {
    const moex = await get_index(IndexInvesting.IMOEX);
    const sp500 = await get_index(IndexInvesting.SP500);
    const nasdaq = await get_index(IndexInvesting.NASDAQ);
    const nvda = await get_index(IndexInvesting.NVDA);
    const btc_usd = await get_index(IndexInvesting.BTCUSD);
    const brent = await get_index(IndexInvesting.BRENT);

    const caret = "\r\n";

    await bot.telegram.sendMessage(
        secrets.telegramInvestingBotId!,
        `🇷🇺 ${moex.dateTime} : Индекс Мосбиржи = <b>${moex.value}</b>` + caret +
             `🇱🇷 ${sp500.dateTime} : Индекс SP500 = <b>${sp500.value}</b>` + caret +
             `🇱🇷 ${nvda.dateTime} : nvda = <b>${nvda.value}</b>` + caret +
             `🇱🇷 ${brent.dateTime} : brent = <b>${brent.value}</b>` + caret +
             `  ₿   ${btc_usd.dateTime} : BTC/USD = <b>${btc_usd.value}</b>` + caret +
             `🇱🇷 ${nasdaq.dateTime} : Индекс NASDAQ = <b>${nasdaq.value}</b>`,
        {parse_mode: `HTML`}
    );
}

exec_investing_robot()
    .then(r => console.log('exec_investing_robot finished ' + r))
    .catch(err => console.log(err));


