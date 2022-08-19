import {investing} from "investing-com-api";
import moment from "moment";

export enum IndexInvesting {
    SP500 = 'indices/us-spx-500',
    NASDAQ = 'indices/nq-100',
    NVDA = 'equities/nvidia-corp',
    BTCUSD = 'crypto/bitcoin/btc-usd',
    BRENT = 'commodities/brent-oil',
    IMOEX = 'indices/mcx'
}

export interface Index {
    dateTime: string,
    value: number,
}

export const get_index = async (i: IndexInvesting): Promise<Index> => {
    let response = // ! не трогать
        await investing(i, 'P1D', 'PT1M'); // ! не трогать
    response.sort((a:any, b:any) => b.date - a.date);

    const index: Index = {
        dateTime: moment(response[0].date).format('DD.MM.YYYY HH:mm'),
        value: response[0].value
    };

    console.log(index.dateTime + ' : ' +  index.value);

    return index;
}