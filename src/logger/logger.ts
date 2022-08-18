const winston = require('winston');

const path = './logs/'

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'deals-service' },
    transports: [
        new winston.transports.File({ filename: path + 'error.log', level: 'error' }),
        new winston.transports.File({ filename: path + 'combined.log', level: 'debug' }),
    ],
});

export const logger_market_depth = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'market-depth-service' },
    transports: [
        new winston.transports.File({ filename: path+'error_market_depth.log', level: 'error' }),
        new winston.transports.File({ filename: path+'combined_market_depth.log', level: 'debug' }),
    ],
});

export const logger_clickhouse = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'clickhouse-database' },
    transports: [
        new winston.transports.File({ filename: path + 'clickhouse_error.log', level: 'error' }),
        new winston.transports.File({ filename: path + 'clickhouse.log', level: 'debug' }),
    ],
});