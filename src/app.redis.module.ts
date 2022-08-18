import {Module} from "@nestjs/common";
import {createClient} from "redis";
import {AppController} from "./app.controller";
import {RedisController} from "./app.redis.controller";
import {REDIS_HOST, REDIS_PORT} from "./db/redis/infra/redis/redis.config";

@Module({
    //controllers: [RedisController],
    providers: [
        {
            provide: 'REDIS_OPTIONS',
            useValue: {
                url: REDIS_HOST,
                port: REDIS_PORT
            }
        },
        {
            inject: ['REDIS_OPTIONS'],
            provide: 'REDIS_CLIENT',
            useFactory: async (options: { url: string }) => {
                const client = createClient(options);
                await client.connect();
                return client;
            }
        }
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule {}