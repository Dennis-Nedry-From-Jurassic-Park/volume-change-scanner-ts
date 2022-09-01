import { RealAccount, TinkoffAccount, TinkoffInvestApi } from 'tinkoff-invest-api';
import { FindInstrumentRequest, InstrumentIdType, Share } from 'tinkoff-invest-api/cjs/generated/instruments';
import { OrderDirection, OrderType } from 'tinkoff-invest-api/cjs/generated/orders';

const api = new TinkoffInvestApi({ token: 't.6XgPKjJ72Ri_w7Ft_H7mlwtTsprvfMjJCPl-KD1dZJECzfRat7OYujU4d8X52GQC_g1gj6Of1DkM2ryBJ7DZCQ' });

import {v4 as uuidv4} from 'uuid';

const shares = async () => {
  const shares: Share[] = require('../../temp/US_shares.json');

  const share = shares.filter( (s:any) => { return s.ticker === 'TSN' })[0];
  const share2 = shares.filter( (s:any) => { return s.lot > 1 })[0];

  console.log(share.ticker + ' ' + share.figi + ' ' + share.lot)
  console.log(share2)
}
const main = async () => {
  const { accounts } = await api.users.getAccounts({});
  console.log(accounts)
  // const { shareBy } = await api.instruments.shareBy(  { // Лотность
  //   idType: InstrumentIdType.INSTRUMENT_ID_TYPE_TICKER,
  //   classCode: '',
  //   id: 'AAPL'
  // } );

  // idType: InstrumentIdType;
  // /** Идентификатор class_code. Обязателен при id_type = ticker. */
  // classCode: string;
  // /** Идентификатор запрашиваемого инструмента. */
  // id: string;
  // const { instrument } = await api.instruments.findInstrument(  { query: ""} );

  //

  const account: TinkoffAccount = new RealAccount(api, '2030966655')

  const ticker = 'TSN' // TODO: change
  const price = 82.5

  const shares: Share[] = require('../../temp/US_shares.json');

  const share = shares.filter( (s:any) => { return s.ticker === ticker })[0];

  const num_shares = 1;

  const order = await account.postOrder({
    //figi: 'BBG000C0HQ54', // ENDP
    //figi: 'BBG000DKCC19', // tsn
    figi: share.figi, // GILD
    quantity: num_shares * share.lot,
    price: api.helpers.toQuotation(price),
    direction: OrderDirection.ORDER_DIRECTION_BUY,
    orderType: OrderType.ORDER_TYPE_LIMIT,
    orderId: ticker + '-' + uuidv4(),
  });
  console.log(order)

  const { orders } = await account.getOrders();

  console.log(orders)

}

shares();


















// import {
// 	BrokerReportRequest,
// 	GenerateBrokerReportRequest,
// 	GetBrokerReportRequest,
// 	OperationsRequest,
// 	OperationState ,
// 	Operation ,
// 	OperationsResponse,
// 	GetBrokerReportResponse,
//     BrokerReportResponse,
//     GetDividendsForeignIssuerRequest, GetDividendsForeignIssuerResponse, 
//     GenerateDividendsForeignIssuerReportRequest, GetDividendsForeignIssuerReportRequest
// } from '../../protos_ts/operations';

// import {
// 	OperationsServiceClient
// } from '../../protos_ts/operations.client';

// import {
// 	PostOrderRequest,
// 	OrdersStreamServiceClient,
// 	PostOrderResponse
// } from '../../protos_ts/orders.client';


// export interface PostOrderOptions {
//   instrumentFigi: string;
//   accountId: string;
// }

// /*
// async function postOrder(
//   options: PostOrderOptions,
//   orderType: "ORDER_TYPE_MARKET" | "ORDER_TYPE_LIMIT"
// ) {
//   const request: PostOrderRequest = {
//     figi: options.instrumentFigi,
//     quantity: options.lots,
//     price: options.price ? QuotationUtils.fromBig(options.price) : undefined,
//     direction:
//       options.orderDirection === OrderDirection.BUY
//         ? "ORDER_DIRECTION_BUY"
//         : "ORDER_DIRECTION_SELL",
//     orderId: options.orderId,
//     accountId: options.accountId,
//     orderType,
//   };

//   this.Logger.debug(
//     this.TAG,
//     `>> Post order with params: ${JSON.stringify(options)}`
//   );

//   const requestFn = this.client.orders.postOrder.bind(this.client.orders);

//   return await new Promise<UncompletedOrder>((res, rej) => {
//     requestFn(request, (e, v) => {
//       try {
//         if (e) {
//           throw e;
//         }

//         if (!v) {
//           throw new Error("Get undefined order response!");
//         }

//         const data = this._parseUncompletedOrder(v, options);
//         this.postedOrders.set(data.id, {
//           accountId: data.accountId,
//           orderId: data.id,
//         });

//         this.Logger.debug(
//           this.TAG,
//           `<< Post order with params: ${JSON.stringify(
//             options
//           )}\n${JSON.stringify(data)}`
//         );

//         res(data);
//       } catch (e) {
//         rej(new PostOrderFatalError(request, e.message));
//       }
//     });
//   });
// }*/



// import moment from 'moment';
// //import * from 'moment-timezone';

// import {Timestamp} from '../../protos_ts/google/protobuf/timestamp';

// import {grpcTransport} from '../auth/connection';

// import {_stringify} from '../utils/json';

// import {asyncWriteFile} from '../utility-methods/file';
// import { GetDividendsForeignIssuerReportResponse } from '../../protos_ts/operations';
// import GoogleSpreadsheet from '../google-spreadsheet/google.spreadsheet';
// import { OrdersStreamService } from '../../protos_ts/orders';

// const getMonths = (start: any, end: any) =>
//     Array.from({ length: end.diff(start, 'month') + 1 }).map((_, index) =>
//       moment(start).add(index, 'month'),//.format('MM.YYYY'),
//     );

// function delay(ms: number) {
//     return new Promise( resolve => setTimeout(resolve, ms) );
// }

// // const sheet = 'B2-IIS'
// // const gs = new GoogleSpreadsheet(sheet);
    
// const create_order = async (
//   accountId: string,
//   from: Date,
//   to: Date,
// ) => {
//   const ordersStreamServiceClient = new OrdersStreamServiceClient(grpcTransport());
//   ordersStreamServiceClient.tradesStream.
//   //ordersStreamServiceClient.methods = MethodInfo.
//   const postOrderRequest = PostOrderRequest.create();
//   postOrderRequest.

//   const response = await operationsServiceClient.getOperations(operationsRequest).response;
  

//   const only_divs = response.operations.filter( (operation:Operation) => {
//     return operation.type === 'Выплата дивидендов'
//   } )

//   console.log(_stringify(only_divs))

// }     



// const get_operations = async (
//   accountId: string,
//   from: Date,
//   to: Date,
// ) => {
//   const operationsServiceClient = new OperationsServiceClient(grpcTransport());
//   const operationsRequest = OperationsRequest.create();
//   operationsRequest.accountId = accountId;
//   operationsRequest.from = Timestamp.fromDate(from);
//   operationsRequest.to = Timestamp.fromDate(to);
//   operationsRequest.state = OperationState.EXECUTED;

//   const response = await operationsServiceClient.getOperations(operationsRequest).response;
  

//   const only_divs = response.operations.filter( (operation:Operation) => {
//     return operation.type === 'Выплата дивидендов'
//   } )

//   console.log(_stringify(only_divs))

// } 

// // const start = moment('12.2021','MM.YYYY');
// //   const end   = moment('01.2022','MM.YYYY');
// //   const months = getMonths(start,end)

// // const start = m.clone().startOf('month').add(+3,'hours')//.tz("Europe/Moscow");
// //     const end = m.clone().endOf('month').add(+3,'hours');
// get_operations("2030966655", moment('01.12.2021','DD-MM.YYYY').toDate(), moment('31.01.2022','DD-MM.YYYY').toDate())




// const generate_broker_report_for_the_current_year = async (
// ) => {
//   ///moment().locale('ru');
//   ///moment().tz.setDefault("Europe/Moscow");  
//   const start = moment('12.2021','MM.YYYY');
//   const end   = moment('01.2022','MM.YYYY');
//   const months = getMonths(start,end)

//  // console.log(months)

//   let obj: any = {};

//   months.forEach(async (m:any) => {
//     const start = m.clone().startOf('month').add(+3,'hours')//.tz("Europe/Moscow");
//     const end = m.clone().endOf('month').add(+3,'hours');

//     await delay(5000);

//     console.log(start.toDate());
//     console.log(end.toDate());

//     const div = await generate_dividend_report("2030966655", start.toDate(), end.toDate()).then(
//       it => {
//         console.log(it);
//         //Object.entries(it).forEach(([key,value]) => { console.log(obj[key] + " = " + value); obj[key] = value })
//         //it.forEach((element:any) => {
//           //arrDivs.
//           //.push(element)
//           //console.log(element)
//         //});
      
//         //return it
//       }
//     )//.then(it => {return it} );
//     //Object.entries(div).forEach(([key,value]) => { arrDivs[key] = value })
//     //arrDivs.push(div)
//     //console.log(arrDivs)

//    // const fileName = "../../dividents-" + moment().format('YYYY-MM-DD_hh-mm-ss').toString() + ".json";

//   //asyncWriteFile(fileName, arrDivs);
//   });

//   const fileName = "../../dividents-" + moment().format('YYYY-MM-DD_hh-mm-ss').toString() + ".json";

//   asyncWriteFile(fileName, _stringify(obj));
// }



// //generate_broker_report_for_the_current_year();


// const generate_broker_report = async (
//   from: Date,
//   to: Date,

// ): Promise<string> => {
//   const genBrokerReportRequest = GenerateBrokerReportRequest.create();
//   genBrokerReportRequest.accountId = "2030966655";
//   genBrokerReportRequest.from = Timestamp.fromDate(from);
//   genBrokerReportRequest.to = Timestamp.fromDate(to);

//   return "";
// }















// //generate_broker_report_for_the_current_year();







// // {
// //   oneofKind: 'generateDivForeignIssuerReportResponse',
// //   generateDivForeignIssuerReportResponse: { taskId: '1a5196b9-4cb1-42b6-a5a0-60f64ff51a02' }
// // }

// // const taskId = generate_dividend_report(
// //   "2030966655",
// //   moment().subtract(2, 'months').toDate(),
// //   moment().subtract(1, 'months').toDate()
// // )




// const report = async () => {
//     const operationsServiceClient = new OperationsServiceClient(grpcTransport());
//     const genBrokerReportRequest = GenerateBrokerReportRequest.create();
    
//     const getBrokerReportRequest = GetBrokerReportRequest.create();
//     getBrokerReportRequest.taskId = "2de32aae-7afc-4874-a130-167ee783b6d9"
//     genBrokerReportRequest.accountId = "2030966655";
//     // moment().startOf('year')
    
//     genBrokerReportRequest.from = Timestamp.fromDate(moment().subtract(7, 'days').toDate());
//     genBrokerReportRequest.from = Timestamp.fromDate(moment().subtract(7, 'days').toDate());
//     genBrokerReportRequest.to = Timestamp.fromDate(moment().toDate());

//     const brokerReportRequest = BrokerReportRequest.create();
//     const getDividendsForeignIssuerRequest = GetDividendsForeignIssuerRequest.create();
   
                                             
    
//     const getDividendsForeignIssuerReportRequest = GetDividendsForeignIssuerReportRequest.create();
//     getDividendsForeignIssuerReportRequest.taskId = 
//     '061d153e-a16f-4170-af50-0a128eaa82da'
//     //'cb69c8dc-f820-4fcb-ad0a-8ee399186841'

//     // getDividendsForeignIssuerRequest.payload = {
//     //     oneofKind : "generateDivForeignIssuerReport",
//     //     generateDivForeignIssuerReport : generateDividendsForeignIssuerReportRequest
//     // }     
//     getDividendsForeignIssuerRequest.payload = {
//         oneofKind : "getDivForeignIssuerReport",
//         getDivForeignIssuerReport : getDividendsForeignIssuerReportRequest
//     }   
//     // brokerReportRequest.payload = {
//     //     oneofKind : "getBrokerReportRequest",
//     //     getBrokerReportRequest : getBrokerReportRequest
//     // }

//     //let resp: GetBrokerReportResponse
//     //        = await operationsServiceClient.getBrokerReport(brokerReportRequest).response as GetBrokerReportResponse;
//       let obj: any;     
//       let resp = 
//            await operationsServiceClient.getDividendsForeignIssuer(
//              getDividendsForeignIssuerRequest
//              ).response.then(
//                it => obj = Object(it.payload)
//              )
//              console.log(obj.divForeignIssuerReport)







//              //console.log(await _stringify(it.payload))
//            //.then( it => it.payload.oneofKind)
    











//    // let _brokerReportResponse = BrokerReportResponse.create();

//      // brokerReportRequest.payload = {
//     //     oneofKind : "generateBrokerReportRequest",
//     //     generateBrokerReportRequest : genBrokerReportRequest
//     // }
//     //(await resp.response).payload =
//     // "getBrokerReportRequest"
//     //resp.payload.oneofKind = "getBrokerReportResponse"
    
//     //console.log(await operationsServiceClient.getBrokerReport(brokerReportRequest).response)
//     //console.log(resp)
// }
// //console.log(moment().subtract(15, 'days').toDate())
//     //console.log(moment().toDate())
// //report();

