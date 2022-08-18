import {MoneyValue, Quotation} from "tinkoff-invest-api/cjs/generated/common";
import {api} from "../api.ti.common";

export const toNum = (value:Quotation | MoneyValue | undefined): number | undefined => {
    return api.helpers.toNumber(value) ;
}