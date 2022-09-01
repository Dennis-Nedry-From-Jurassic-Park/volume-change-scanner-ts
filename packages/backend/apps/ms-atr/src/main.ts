import {NestFactory} from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {AppModule2} from './app';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {RedisModule} from "./app.redis.module";
import {REDIS_PORT} from "../../ms-base/src/db/redis/infra/redis/redis.config";
import {AppPrometheusModule} from "./app.prometheus.module";
import {PORT_MAIN_ROBOT} from "../../ms-base/src/app/ports";
import {ROUTE_ZERO} from "../../ms-base/src/app/routes";


const apiMetrics = require('prometheus-api-metrics');


async function bootstrap() {
    // const app_redis = await NestFactory.createMicroservice<MicroserviceOptions>(
    //     RedisModule,
    //     {
    //         transport: Transport.REDIS,
    //         options: {
    //             host: 'localhost',
    //             port: REDIS_PORT,
    //             retryAttempts: 5,
    //             retryDelay: 3000
    //         }
    //     }
    // )

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule2,
        new FastifyAdapter()
    );

    //const app_p = await NestFactory.create(AppPrometheusModule2);
    //const app_p = await NestFactory.create(AppPrometheusModule2);

    //     .create<NestFastifyApplication>(
    //     AppPrometheusModule2,
    //     new FastifyAdapter()
    // );

    await app.enableCors();
   // app_p.enableCors();
    //app.use(apiMetrics())
    //await app_p.listen(3001);
    await app.listen(PORT_MAIN_ROBOT, ROUTE_ZERO);
    //await app_redis.listen();
    // http://localhost:3002/shares/get-candles
    // npm run .start
}

// const client = require('prom-client');
// const express = require('express');
//
// const metricExporter = require('./metrics');
//
// const app = express();
//
// // Initialize metrics
// const registry = new client.Registry();
// metricExporter(registry);
//
// // Report Prometheus metrics on /metrics
// app.get('/metrics', async (req, res, next) => {
//     res.set('Content-Type', registry.contentType);
//     res.end(registry.metrics());
//
//     next();
// });


// Run the server
//app.listen(9200, '0.0.0.0', () => console.log('App started!'));

bootstrap().then(()=>{
    process.stdout.write(`Robot is running on: http://localhost:${PORT_MAIN_ROBOT}`);
}).catch(err=>{
    console.error(err);
    process.exit(1);
});