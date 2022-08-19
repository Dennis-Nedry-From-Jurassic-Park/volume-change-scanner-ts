import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {PrometheusModule} from "@willsoto/nestjs-prometheus";
import {CustomPrometheusController} from "./app.custom.prometheus.controller";
//import { RedisModule} from 'nestjs-redis'

@Module({
    imports: [
        PrometheusModule.register({
            controller: CustomPrometheusController,
            //path: 'metrics',
            defaultMetrics: {
                enabled: true
            }
        }),
       // RedisModule.register(options)
    ],
    controllers: [AppController]
})

export class AppModule {} // http://localhost:3002/health