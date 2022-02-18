import TinkoffInvestmentsApi from "./tinkoff-investments-api";
import GoogleSpreadsheet from './google-spreadsheet/api';

import {Operation} from "@tinkoff/invest-openapi-js-sdk";

import convertFigiToTicker from './utility-methods/ticker';
import bot from './telegram/bot';
import moment from 'moment';
import {formatBuySellCase, formatFundCase, formatStockCase} from "./utility-methods/numeralize";

export const updateSpreadsheet = async (sheet: string) => {
    const brokerAccountId = sheet === 'B2-IIS' ? "2030966655" : "2038470031";

    const gs = new GoogleSpreadsheet(sheet);
    const api = new TinkoffInvestmentsApi(brokerAccountId).api;

    const earliestDateTime = await gs.getEarliestDateTime();

    let dateTime = await gs.getDateTime(earliestDateTime);

    await gs.removeEarliestDateTime();

    await gs.updateEarliestDateTime(dateTime);

    const from = dateTime;
    const to = moment().toISOString();

    let operations: Operation[] = (await api.operations({from, to})).operations;

    console.log(JSON.stringify(operations, null, 2));

    let result = [];

    for (const o of operations) {
        let obj;
        let ticker;
        let name;
        let figi = o.figi;
        let comission =  o?.commission?.value || 0;

        if (typeof figi === 'undefined') {
            ticker = '';
            name = '';
        } else {
            obj = (await convertFigiToTicker(api, figi));
            ticker = obj?.ticker;
            name = obj?.name;
        }

        result.push(
            [
                o.instrumentType,
                o.operationType,
                o.figi,
                ticker,
                name,
                o.date,
                o.quantity,
                o.price,
                o.payment,
                o.payment + comission,
                o.currency
            ]
        );
    }

    await gs.appendAll(result);

    if (result.length === 0) {
        console.log("no new portfolio operations");
        bot.telegram.sendMessage("-456284179", `no new portfolio operations for sheet ${sheet}`);
    } else {
        const instrumentTypes = ['Stock', 'Etf'];
        const operationTypes = ['Sell', 'Buy']
        let message: string = `${sheet}\n`;
        let msg: string[] = [];

        result.forEach(function (o) {
            if (instrumentTypes.includes(o[0]) && operationTypes.includes(o[1])) {
                const isStock = o[0] === 'Stock';
                const genus = isStock ? false : true;
                const isSell =  o[1] === 'Sell';
                const count = Number(o[6]);
                const instrumentType = isStock ? formatStockCase(count) : formatFundCase(count);
                const operationType =
                    isSell ? formatBuySellCase(count, genus, false) : formatBuySellCase(count, genus, true);

                message += `${o[5]}. ${operationType} ${instrumentType} ${o[4]} (${o[3]}) по цене ${o[9]} ${o[10]}.\n`;

                if(message.length >= 3750){
                    msg.push(message);
                    message = '';
                }
            }
        });

        msg.forEach(m => {
            console.log(`sended message : ${m}`);
            bot.telegram.sendMessage("-456284179", `${msg}`);
        });
    }
};