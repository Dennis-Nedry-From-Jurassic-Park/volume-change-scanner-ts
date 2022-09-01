import {getAppRootDir} from "../utility-methods/file";

const winston = require('winston');

const path = getAppRootDir() + "\\logs\\";

import  DailyRotateFile from 'winston-daily-rotate-file';

const get_transport = (appname: string, level: string): DailyRotateFile => {
    return new DailyRotateFile({
        filename: `${appname}-%DATE%.log`,
        dirname: path,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '100m',
        maxFiles: '28d',
        level: level
    });
}

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'deals-service' },
    transports: [
        get_transport('error', 'error'),
        get_transport('combined', 'debug')
    ],
});

export const logger_market_depth = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'market-depth-service' },
    transports: [
        get_transport('error_market_depth', 'error'),
        get_transport('combined_market_depth', 'debug')
    ],
});

export const logger_clickhouse = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'clickhouse-database' },
    transports: [
        get_transport('clickhouse_error', 'error'),
        get_transport('clickhouse', 'debug')
    ],
});
export const logger_candles = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'clickhouse-database' },
    transports: [
        get_transport('candles_error', 'error'),
        get_transport('candles', 'debug')
    ],
});
export const logger_cron = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'ms-bull-cron' },
    transports: [
        get_transport('cron_error', 'error'),
        get_transport('cron', 'debug')
    ],
});