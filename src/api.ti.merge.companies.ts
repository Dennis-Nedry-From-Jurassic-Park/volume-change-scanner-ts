import secrets from './utility-methods/env';

import {TinkoffInvestApi} from 'tinkoff-invest-api';
import {InstrumentStatus} from "tinkoff-invest-api/cjs/generated/instruments";
import {asyncWriteFile} from "./utility-methods/file";
import {instrumentsService} from "./ms-ti-base/instruments.service";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

export const create_shares_base = async () => {
    const shares = await api.instruments.shares({instrumentStatus: InstrumentStatus.INSTRUMENT_STATUS_BASE})
    await asyncWriteFile('../../shares_all.json', JSON.stringify(shares));
}
export const create_shares_all = async () => {
    const shares = await api.instruments.shares({instrumentStatus: InstrumentStatus.INSTRUMENT_STATUS_ALL})
    await asyncWriteFile('../../shares_status_all.json', JSON.stringify(shares));
}

export const main = async () => {
    const share = await instrumentsService.get_instrument_by_ticker('INTC');
    console.log(share)
}