// // service.ts
// import { Injectable } from "@nestjs/common";
// import * as client from "prom-client";
// import { InjectMetric } from "@willsoto/nestjs-prometheus";
//
// import { makeGaugeProvider } from "@willsoto/nestjs-prometheus";
//
//
// @Injectable()
// export class Service {
//     constructor(@InjectMetric("account_name") public account_name: client.Gauge<string>) {}
//     //constructor(@InjectMetric("account_name") public account_name: makeGaugeProvider<string>) {}
// }