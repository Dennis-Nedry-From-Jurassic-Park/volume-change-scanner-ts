import {NestFactory} from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {AppModule2} from './app';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {RedisModule} from "./app.redis.module";
import {REDIS_PORT} from "./db/redis/infra/redis/redis.config";


export const PORT = 3002

async function bootstrap() {
    const app_redis = await NestFactory.createMicroservice<MicroserviceOptions>(
        RedisModule,
        {
            transport: Transport.REDIS,
            options: {
                host: 'localhost',
                port: REDIS_PORT,
                retryAttempts: 5,
                retryDelay: 3000
            }
        }
    )

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule2,
        new FastifyAdapter()
    );
    app.enableCors();
    await app.listen(PORT);
    await app_redis.listen();
    // http://localhost:3002/shares/get-candles
    // npm run .start
}

bootstrap().then(()=>{
    console.log('robot runned');
    process.stdout.write(`Application is running on: http://localhost:${PORT}`);
}).catch(err=>{
    console.error(err);
    process.exit(1);
});