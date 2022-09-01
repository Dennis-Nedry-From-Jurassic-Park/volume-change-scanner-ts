import secrets from '../../ms-base/src/utility-methods/env';

import {RealAccount, TinkoffAccount, TinkoffInvestApi} from 'tinkoff-invest-api';
import {Share} from 'tinkoff-invest-api/cjs/generated/instruments';
import {OrderDirection, OrderType} from 'tinkoff-invest-api/cjs/generated/orders';
import {StopOrderDirection, StopOrderExpirationType, StopOrderType} from 'tinkoff-invest-api/cjs/generated/stoporders';

import {v4 as uuidv4} from 'uuid';
import {logger} from "../../ms-base/src/logger/logger";
import {ACCOUNT} from "../../ms-ti-base/users.service";
import {instrumentsService} from "../../ms-ti-base/instruments.service";
import {toQuotation} from "../../ms-ti-base/number";
import {assert_max_cash_per_deal} from "../../ms-tg-investing-exchange-indices/risk.per.deal";

const token = secrets.token!;

const api = new TinkoffInvestApi({ token: token });

const deal = async (
    ticker:string,
    price: number,
    num_shares: number,
    orderDirection: OrderDirection,
    orderType: OrderType,
    acc: typeof ACCOUNT
) => {
    const share = await instrumentsService.get_share_by_ticker(ticker);

   // await assert_max_cash_per_deal(acc, share, price * num_shares)
    // TODO: count deals assert
    const account: TinkoffAccount = new RealAccount(api, acc)

    try {
        const orderId = uuidv4();
        
        const order = await account.postOrder({
            figi: share.figi,
            quantity: num_shares,// * share.lot,
            price: toQuotation(price),
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
    acc: typeof ACCOUNT
) => {
    const share = await instrumentsService.get_share_by_ticker(ticker);

    //await assert_max_cash_per_deal(ACCOUNT.IIS, share, price * num_shares)

    const account: TinkoffAccount = new RealAccount(api, acc)

    try {
        const orderId = uuidv4();

        const stop_order = await api.stoporders.postStopOrder({
            figi: share.figi,
            quantity: num_shares, //  * share.lot
            price: toQuotation(price),
            stopPrice: toQuotation(stopPrice),
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
    acc: typeof ACCOUNT
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
    acc: typeof ACCOUNT
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


// 62fb3cfd1185b7f105821c85bea0c938
// 62fb3d903e80fd1e435e45bd3c1326c7
//deal('GAZP', 1.56, 1, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.BROKERAGE)
//deal('FULC', 9.02, 2, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_LIMIT, ACCOUNT.IIS)
//deal('TATN', 400, 1, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_LIMIT, ACCOUNT.BROKERAGE)
//deal('ISKJ', 11.59, 2, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.BROKERAGE)



//deal('MOMO', 0.56, 1, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.BROKERAGE)
//deal('FSLY', 0.56, 1, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.BROKERAGE)
//deal('EAR', 2.15, 25, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_LIMIT, ACCOUNT.IIS)
//deal('EAR', 2.15, 5, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.IIS)
//deal('EAR', 2.4, 5, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.IIS)
//('ENDP', 0.37, 10, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.BROKERAGE)
//deal('MOMO', 2.5, 1, OrderDirection.ORDER_DIRECTION_BUY, OrderType.ORDER_TYPE_MARKET, ACCOUNT.BROKERAGE)

// stop_deal(
//     'SMLT',
//     3144,
//     3146,
//     2,
//     StopOrderDirection.STOP_ORDER_DIRECTION_SELL,
//     StopOrderExpirationType.STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL,
//     StopOrderType.STOP_ORDER_TYPE_STOP_LIMIT,
//     ACCOUNT.IIS
// )

// stop_deal(
//     'MOMO',
//     5.05,
//     5.08,
//     33,
//     StopOrderDirection.STOP_ORDER_DIRECTION_SELL,
//     StopOrderExpirationType.STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL,
//     StopOrderType.STOP_ORDER_TYPE_STOP_LIMIT,
//     ACCOUNT.BROKERAGE
// )

// stop_deal(
//     'MOMO',
//     4.99,
//     5.02,
//     33,
//     StopOrderDirection.STOP_ORDER_DIRECTION_SELL,
//     StopOrderExpirationType.STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL,
//     StopOrderType.STOP_ORDER_TYPE_STOP_LIMIT,
//     ACCOUNT.BROKERAGE
// )


const shares = async () => {
  const shares: Share[] = require('../temp/US_shares.json');

  const share = shares.filter( (s:any) => { return s.ticker === 'TSN' })[0];
  // const share = shares.filter( (s:any) => { return s.lot > 1 })[0];

  console.log(share.ticker + ' ' + share.figi + ' ' + share.lot)
}

// shares();