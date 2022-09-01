import { Controller, Get } from '@nestjs/common';
import { RedisService } from './app.redis.service';
import {v4} from "uuid";

@Controller()
export class RedisController {
    constructor(private readonly redisService: RedisService) {}

    @Get("/setHello")
    async setHello() {
        return this.redisService.setHello();
    }
    // @Get("/getHello")
    // async getHello() {
    //     return this.redisService.getHello();
    // }

    @Get("/setKey")
    async setKey() {
        return this.redisService.setKey('key-'+v4(), 'value-'+v4());
    }

    @Get("/greeting")
    async getHello() {
        return this.redisService.getHello();
    }

    @Get("/greeting-async")
    async getHelloAsync() {
        return this.redisService.getHelloAsync();
    }

    @Get("/publish-event")
    async publishEvent() {
        this.redisService.publishEvent();
    }
}