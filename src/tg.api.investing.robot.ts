import secrets from './utility-methods/env';

import bot from './telegram/bot'
import { get_MOEX_index } from './ti.api.service.utils';

const exec_investing_robot = async () => {
    const moex = await get_MOEX_index();

    bot.telegram.sendMessage(
        secrets.telegramInvestingBotId!,
        `🇷🇺 ${moex.dateTime} : Индекс Мосбиржи = <b>${moex.imoex}</B>`,
        { parse_mode: `HTML` }
    );
}

exec_investing_robot();


