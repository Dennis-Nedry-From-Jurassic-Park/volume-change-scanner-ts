import secrets from './utility-methods/env';

import { RealAccount, TinkoffAccount, TinkoffInvestApi } from 'tinkoff-invest-api';
import { Share } from 'tinkoff-invest-api/cjs/generated/instruments';
import { OrderDirection, OrderType } from 'tinkoff-invest-api/cjs/generated/orders';
import { StopOrderDirection, StopOrderExpirationType, StopOrderType } from 'tinkoff-invest-api/cjs/generated/stoporders';

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

import {v4 as uuidv4} from 'uuid';
import moment from 'moment';
import { ACCOUNT, get_share_by_ticker } from './ti.api.service.utils';

const winston = require('winston');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'deals-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log', level: 'debug' }),
    ],
  });

const deal = async (
    ticker:string,
    price: number,
    num_shares: number,
    orderDirection: OrderDirection,
    orderType: OrderType,
    acc: ACCOUNT
) => {
    const account: TinkoffAccount = new RealAccount(api, acc)

    const share = await get_share_by_ticker(ticker);

    try {
        const orderId = uuidv4();
        
        const order = await account.postOrder({
            figi: share.figi,
            quantity: num_shares,// * share.lot,
            price: api.helpers.toQuotation(price),
            direction: orderDirection,
            orderType: orderType,
            orderId: orderId,
        });
        logger.log('debug', order);
        console.log(order)

        const { orders } = await account.getOrders();

        logger.log('debug', "orders: " + JSON.stringify(orders));
        console.log(orders);
    } catch(error:any){
        logger.log('error', error);
        console.log(error);
    }
}

const stop_deal = async (
    ticker:string,
    price: number,
    stopPrice: number,
    num_shares: number,
    stopOrderDirection: StopOrderDirection,
    expirationType: StopOrderExpirationType,
    stopOrderType: StopOrderType,
    acc: ACCOUNT
) => {
    const account: TinkoffAccount = new RealAccount(api, acc)

    const share = await get_share_by_ticker(ticker);

    try {
        const orderId = uuidv4();

        const stop_order = await api.stoporders.postStopOrder({
            figi: share.figi,
            quantity: num_shares, //  * share.lot
            price: api.helpers.toQuotation(price),
            stopPrice: api.helpers.toQuotation(stopPrice),
            direction: stopOrderDirection,
            accountId: acc,
            expirationType: expirationType,
            stopOrderType: stopOrderType
        });
        
        console.log(stop_order.stopOrderId)
        logger.log('debug', "stopOrderId: " + stop_order.stopOrderId);

        const { orders } = await account.getOrders();

        logger.log('debug', "orders: " + JSON.stringify(orders));
        console.log(orders);
    } catch(error:any){
        logger.log('error', error);
        console.log(error);
    }
}

const cancel_orders_deal = async (
    orderId:string,
    acc: ACCOUNT
) => {
    try {
        const cancelled_order = await api.orders.cancelOrder({
            accountId: acc,
            orderId: orderId
        });
        
        logger.log('debug', "DateTime for cancelled order: " + cancelled_order.time);
        console.log((cancelled_order).time)

    } catch(error:any){
        logger.log('error', "cancelled order: " + error);
        console.log(error)
    }
}
const cancel_stoporders_deal = async (
    stopOrderId:string,
    acc: ACCOUNT
) => {
    try {
        const cancelled_stoporder = await api.stoporders.cancelStopOrder({
            accountId: acc,
            stopOrderId: stopOrderId
        });
        
        console.log(cancelled_stoporder.time)
        logger.log('debug', "DateTime for cancelled stoporder: " + cancelled_stoporder.time);
    } catch(error:any){
        logger.log('error', "cancelled stoporder: " + error);
        console.log(error)
    }
}

deal('CCL', 9.23, 5, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_LIMIT, ACCOUNT.IIS)
//deal('ENDP', 0.4, 50, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_LIMIT, ACCOUNT.BROKERAGE)

// stop_deal( 
//     'ENDP',
//     0.41,
//     0.41,
//     41,
//     StopOrderDirection.STOP_ORDER_DIRECTION_SELL,
//     StopOrderExpirationType.STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL,
//     StopOrderType.STOP_ORDER_TYPE_TAKE_PROFIT,
//     ACCOUNT.BROKERAGE
// )


const shares = async () => {
  const shares: Share[] = require('../US_shares.json');

  const share = shares.filter( (s:any) => { return s.ticker === 'TSN' })[0];
  // const share = shares.filter( (s:any) => { return s.lot > 1 })[0];

  console.log(share.ticker + ' ' + share.figi + ' ' + share.lot)
}

// shares();