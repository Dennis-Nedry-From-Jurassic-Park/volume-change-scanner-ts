import secrets from '../utility-methods/env';
//const { Telegraf } = require('telegraf');
import { Telegraf } from 'telegraf';
const token = secrets.telegramToken;
const bot = new Telegraf(token);

export default bot;