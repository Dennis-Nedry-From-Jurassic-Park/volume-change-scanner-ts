import {Module} from "@nestjs/common";
import {PrometheusModule} from "@willsoto/nestjs-prometheus";
import {CustomPrometheusController} from "./app.custom.prometheus.controller";
import {AppController} from "./app.controller";

// @Module({
//     imports: [
//         PrometheusModule.register({
//             controller: CustomPrometheusController,
//             //path: 'metrics',
//             defaultMetrics: {
//                 enabled: true
//             }
//         }),
//         // RedisModule.register(options)
//     ]
// })
@Module({
    imports: [
        PrometheusModule.register({

            defaultMetrics: {
                config: {

                },
                enabled: true
            },
            path: "/metrics",


        }),
    ],
})
export class AppPrometheusModule {}
//export class AppPrometheusModule2 {}