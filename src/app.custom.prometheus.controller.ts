import {Controller, Get, Param, Query, Req, Res} from "@nestjs/common";
import {PrometheusController} from "@willsoto/nestjs-prometheus";
import { Request, Response } from 'express';
import {defaultPath, health} from "./app.common";


// const client = require('prom-client');
//
// // Create a Registry to register the metrics
// const register = new client.Registry();
//
// client.collectDefaultMetrics({
//     app: 'node-application-monitoring-app',
//     prefix: 'node_',
//     timeout: 10000,
//     gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
//     register
// });
// const express = require('express');
// const app = express();
//@Controller('metrics')
export class CustomPrometheusController extends PrometheusController {


    // @Get('mymetrics')
    // async mymetrics(@Res() res) {
    //     res.setHeader('Content-Type', register.contentType);
    //     res.send(await register.metrics());
    // }
    //@Get()

    //start=:start&end=:end
    async pen(
        @Query('start') start: number,
        @Query('end') end: number,
        @Res() response: Response,
        @Req() req: Request
    ) {
        console.log("req = " + req.query)
        await super.index(response);
    }
    // async pen(@Res() res: Response, @Param('start') start: string, @Param('end') end: string) {
    //     return this.pen(res,start, end);
    //     //return await super.index(res);
    //     //await super.index(response);
    // }
}