import secrets from "../utility-methods/env";
import {TinkoffInvestApi} from "tinkoff-invest-api";

const token = secrets.token!;

export const api = new TinkoffInvestApi({ token: token });