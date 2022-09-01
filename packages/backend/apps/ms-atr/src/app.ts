import { Module  } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

import {AppModule} from './app.module'
//import {RiskModule} from "./app.ti.risk.module";
import {RedisModule} from "./app.redis.module";
import {AppPrometheusModule} from "./app.prometheus.module";

@Module({
  imports: [
    AppPrometheusModule,
    AppModule,
    //RiskModule,
    //RedisModule,
    RouterModule.register([
      {
        path: 'metrics',
        module: AppPrometheusModule
      },
      // {
      //   path: 'risk',
      //   module: RiskModule
      // },
      {
        path: 'shares',
        module: AppModule
      },
      // {
      //   path: 'redis',
      //   module: RedisModule
      // },
    ]),
  ],
})
export class AppModule2 {}

