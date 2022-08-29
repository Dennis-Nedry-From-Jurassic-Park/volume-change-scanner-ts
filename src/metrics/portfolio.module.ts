import { Module } from "@nestjs/common";
import {
    PrometheusModule,
    makeCounterProvider,
} from "@willsoto/nestjs-prometheus";
//import { Service } from "./service";

@Module({
    imports: [PrometheusModule.register()],
    providers: [
        //Service,
        makeCounterProvider({
            name: "metric_name",
            help: "metric_help",
        }),
    ],
})
export class PortfolioModule {}