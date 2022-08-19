// TODO: import {
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
//
// import {
// 	OperationsServiceClient
// } from '../../protos_ts/operations.client';
//
// import moment from 'moment';
// //import * from 'moment-timezone';
//
// import {Timestamp} from '../../protos_ts/google/protobuf/timestamp';
//
// import {grpcTransport} from '../auth/connection';
//
// import {_stringify} from '../utils/json';
//
// import {asyncWriteFile} from '../utility-methods/file';
// import { GetDividendsForeignIssuerReportResponse } from '../../protos_ts/operations';
// import GoogleSpreadsheet from '../google-spreadsheet/google.spreadsheet';
//
// const getMonths = (start: any, end: any) =>
//     Array.from({ length: end.diff(start, 'month') + 1 }).map((_, index) =>
//       moment(start).add(index, 'month'),//.format('MM.YYYY'),
//     );
//
// function delay(ms: number) {
//     return new Promise( resolve => setTimeout(resolve, ms) );
// }
//
// // const sheet = 'B2-IIS'
// // const gs = new GoogleSpreadsheet(sheet);
//
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
//
//   const response = await operationsServiceClient.getOperations(operationsRequest).response;
//
//
//   const only_divs = response.operations.filter( (operation:Operation) => {
//     return operation.type === 'Выплата дивидендов'
//   } )
//
//   console.log(_stringify(only_divs))
//
// }
//
// // const start = moment('12.2021','MM.YYYY');
// //   const end   = moment('01.2022','MM.YYYY');
// //   const months = getMonths(start,end)
//
// // const start = m.clone().startOf('month').add(+3,'hours')//.tz("Europe/Moscow");
// //     const end = m.clone().endOf('month').add(+3,'hours');
// get_operations("2030966655", moment('01.12.2021','DD-MM.YYYY').toDate(), moment('31.01.2022','DD-MM.YYYY').toDate())
//
//
//
//
// const generate_broker_report_for_the_current_year = async (
// ) => {
//   ///moment().locale('ru');
//   ///moment().tz.setDefault("Europe/Moscow");
//   const start = moment('12.2021','MM.YYYY');
//   const end   = moment('01.2022','MM.YYYY');
//   const months = getMonths(start,end)
//
//  // console.log(months)
//
//   let obj: any = {};
//
//   months.forEach(async (m:any) => {
//     const start = m.clone().startOf('month').add(+3,'hours')//.tz("Europe/Moscow");
//     const end = m.clone().endOf('month').add(+3,'hours');
//
//     await delay(5000);
//
//     console.log(start.toDate());
//     console.log(end.toDate());
//
//     const div = await generate_dividend_report("2030966655", start.toDate(), end.toDate()).then(
//       it => {
//         console.log(it);
//         //Object.entries(it).forEach(([key,value]) => { console.log(obj[key] + " = " + value); obj[key] = value })
//         //it.forEach((element:any) => {
//           //arrDivs.
//           //.push(element)
//           //console.log(element)
//         //});
//
//         //return it
//       }
//     )//.then(it => {return it} );
//     //Object.entries(div).forEach(([key,value]) => { arrDivs[key] = value })
//     //arrDivs.push(div)
//     //console.log(arrDivs)
//
//    // const fileName = "../../dividents-" + moment().format('YYYY-MM-DD_hh-mm-ss').toString() + ".json";
//
//   //asyncWriteFile(fileName, arrDivs);
//   });
//
//   const fileName = "../../dividents-" + moment().format('YYYY-MM-DD_hh-mm-ss').toString() + ".json";
//
//   asyncWriteFile(fileName, _stringify(obj));
// }
//
//
//
// //generate_broker_report_for_the_current_year();
//
//
// const generate_broker_report = async (
//   from: Date,
//   to: Date,
//
// ): Promise<string> => {
//   const genBrokerReportRequest = GenerateBrokerReportRequest.create();
//   genBrokerReportRequest.accountId = "2030966655";
//   genBrokerReportRequest.from = Timestamp.fromDate(from);
//   genBrokerReportRequest.to = Timestamp.fromDate(to);
//
//   return "";
// }
//
// const generate_dividend_report = async (
//   accountId: string,
//   from: Date,
//   to: Date,
// ): Promise<any> => {
//   const operationsServiceClient = new OperationsServiceClient(grpcTransport());
//
//   const generateDividendsForeignIssuerReportRequest = GenerateDividendsForeignIssuerReportRequest.create();
//   generateDividendsForeignIssuerReportRequest.accountId = accountId;
//   generateDividendsForeignIssuerReportRequest.from = Timestamp.fromDate(from);
//   generateDividendsForeignIssuerReportRequest.to = Timestamp.fromDate(to);
//
//   const getDividendsForeignIssuerRequest
//         = GetDividendsForeignIssuerRequest.create();
//   getDividendsForeignIssuerRequest.payload = {
//       oneofKind : "generateDivForeignIssuerReport",
//       generateDivForeignIssuerReport : generateDividendsForeignIssuerReportRequest
//   }
//
//   let payload = await operationsServiceClient
//     .getDividendsForeignIssuer(getDividendsForeignIssuerRequest)
//     .response
//     .then(async (it) => {
//       return Object(it.payload)
//     })
//
//   let dividents = await payload
//   .divForeignIssuerReport
//   .dividendsForeignIssuerReport || [];
//
//   //const div = await _stringify(dividents);
//
//   //console.log("dividents :" + div);
//
//
//
//   return dividents;
//
//   // console.log(div.securityName);
//   // console.log(div.currency);
//   // console.log(Timestamp.toDate(div.paymentDate));
//   // console.log(div.quantity);
//   // const dividend = Number((BigInt(div.dividend.units) + BigInt(div.dividend.nano) )) / 10E8;
//   // const tax = Number((BigInt(div.tax.units) + BigInt(div.tax.nano) )) / 10E8;
//   // const dividendAmount = Number((BigInt(div.dividendAmount.units) + BigInt(div.dividendAmount.nano) )) / 10E8;
//   // console.log(`dividend - tax = ${dividend} - ${tax} = ${dividendAmount}`);
//
//   // console.log(_stringify(div));
//   //console.log(payload.generateDivForeignIssuerReportResponse.taskId);
//   //payload.generateDivForeignIssuerReportResponse.taskId;
// }
//
// //console.log(moment().format('YYYY-MM-DD_hh-mm-ss').toString())
//
// // const check = async () => {
// //   await asyncWriteFile("../../div.log",
// //   //`[{"securityName": "sn"}]`);
// //   "123");
// // }
//
// // check();
//
// // const fileName = "div-" + moment().format('YYYY-MM-DD_hh-mm-ss').toString() + ".json";
// //   //console.log("fileName :" + fileName);
// // ;
//
//
//
//
//
//   /*
// let new_obj: any = {};
// let arr: any[] = [];
// const arr_obj = [
//   {
//     securityName: 'Американская депозитарная расписка на обыкновенные акции класса А Royal Dutch Shell plc',
//     isin: 'US7802592060',
//     issuerCountry: 'США',
//     quantity: 2n,
//     currency: 'USD',
//     recordDate: { seconds: 1636675200n, nanos: 0 },
//     paymentDate: { seconds: 1640736000n, nanos: 0 },
//     dividend: { units: 0n, nano: 480000000 },
//     externalCommission: { units: 0n, nano: 0 },
//     dividendGross: { units: 0n, nano: 960000000 },
//     tax: { units: 0n, nano: 140000000 },
//     dividendAmount: { units: 0n, nano: 820000000 }
//   },
//   {
//     securityName: 'Prudential Financial, Inc._ORD SHS',
//     isin: 'US7443201022',
//     issuerCountry: 'США',
//     quantity: 1n,
//     currency: 'USD',
//     recordDate: { seconds: 1637625600n, nanos: 0 },
//     paymentDate: { seconds: 1640822400n, nanos: 0 },
//     dividend: { units: 1n, nano: 150000000 },
//     externalCommission: { units: 0n, nano: 0 },
//     dividendGross: { units: 1n, nano: 150000000 },
//     tax: { units: 0n, nano: 120000000 },
//     dividendAmount: { units: 1n, nano: 30000000 }
//   }
// ];
//
// arr_obj.forEach((div:any) => {
//   arr.push(
//       [
//           'share',
//           'buy or div',
//           'figi',
//           'ticker',
//           div.securityName,
//           div.paymentDate,
//           div.quantity,
//           div.dividendAmount, // or price
//
//
//           div.tax,
//           div.currency,
//       ]
//   )
// });
//
// console.log(arr);
// */
//
//
//
//
//
//
//
//
//
// //var mapped = arr_obj .map(item => ({ [item.key]: item.value }) );
// //var newObj = Object.assign({}, ...mapped );
// //console.log(newObj );
//
// // const object = arr_obj.reduce(
// //   (new_obj, item) => Object.assign(new_obj, { [item.key]: item.value }), {});
// //Object.assign(new_obj, ...arr_obj);
//
// //Object.assign(new_obj, obj)
// //console.log(new_obj);
// //console.log(arr_obj.map(el));
//
//
// // Object.keys(obj).forEach((key) => {
// //   console.log(obj[key]); // 'Bob', 47
// // });
//
// //Object.entries(obj).forEach(([key,value]) => { new_obj[key] = value })
//
// //
// //console.log(Object.entries(obj));
//
//
//
//
//
//
//
//
//
//
//
//
// //generate_broker_report_for_the_current_year();
//
//
//
//
//
//
//
// // {
// //   oneofKind: 'generateDivForeignIssuerReportResponse',
// //   generateDivForeignIssuerReportResponse: { taskId: '1a5196b9-4cb1-42b6-a5a0-60f64ff51a02' }
// // }
//
// // const taskId = generate_dividend_report(
// //   "2030966655",
// //   moment().subtract(2, 'months').toDate(),
// //   moment().subtract(1, 'months').toDate()
// // )
//
//
//
//
// const report = async () => {
//     const operationsServiceClient = new OperationsServiceClient(grpcTransport());
//     const genBrokerReportRequest = GenerateBrokerReportRequest.create();
//
//     const getBrokerReportRequest = GetBrokerReportRequest.create();
//     getBrokerReportRequest.taskId = "2de32aae-7afc-4874-a130-167ee783b6d9"
//     genBrokerReportRequest.accountId = "2030966655";
//     // moment().startOf('year')
//
//     genBrokerReportRequest.from = Timestamp.fromDate(moment().subtract(7, 'days').toDate());
//     genBrokerReportRequest.from = Timestamp.fromDate(moment().subtract(7, 'days').toDate());
//     genBrokerReportRequest.to = Timestamp.fromDate(moment().toDate());
//
//     const brokerReportRequest = BrokerReportRequest.create();
//     const getDividendsForeignIssuerRequest = GetDividendsForeignIssuerRequest.create();
//
//
//
//     const getDividendsForeignIssuerReportRequest = GetDividendsForeignIssuerReportRequest.create();
//     getDividendsForeignIssuerReportRequest.taskId =
//     '061d153e-a16f-4170-af50-0a128eaa82da'
//     //'cb69c8dc-f820-4fcb-ad0a-8ee399186841'
//
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
//
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
//
//
//
//
//
//
//
//              //console.log(await _stringify(it.payload))
//            //.then( it => it.payload.oneofKind)
//
//
//
//
//
//
//
//
//
//
//
//
//    // let _brokerReportResponse = BrokerReportResponse.create();
//
//      // brokerReportRequest.payload = {
//     //     oneofKind : "generateBrokerReportRequest",
//     //     generateBrokerReportRequest : genBrokerReportRequest
//     // }
//     //(await resp.response).payload =
//     // "getBrokerReportRequest"
//     //resp.payload.oneofKind = "getBrokerReportResponse"
//
//     //console.log(await operationsServiceClient.getBrokerReport(brokerReportRequest).response)
//     //console.log(resp)
// }
// //console.log(moment().subtract(15, 'days').toDate())
//     //console.log(moment().toDate())
// //report();
//
//
// /*
//
// {
//   payload: {
//     oneofKind: 'generateBrokerReportResponse',
//     generateBrokerReportResponse: { taskId: '2de32aae-7afc-4874-a130-167ee783b6d9' }
//   }
// }
//
// */