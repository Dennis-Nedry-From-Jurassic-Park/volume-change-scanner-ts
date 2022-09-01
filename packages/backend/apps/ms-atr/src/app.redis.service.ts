import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { createClient } from '@redis/client';
//import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
    client2 = createClient({
        url: 'redis://localhost:6379'
    });


    constructor(
        @Inject('GREETING_SERVICE') private client: ClientProxy
    ) {
        this.client2.connect().then(() => console.log('Redis client connected'));
    }

    // async setKey2(name: string): Promise<void> {
    //     await this.client.set(KEY, name, { ttl: 3600 });
    // }

    async setKey(key: string, value: string){
        await this.client2.set(key, value);
    }

    async getKey(key: string): Promise<string> {
        const value = await this.client2.get(key);
        console.log(value)
        return ""
    }

    async setHello(){
        return this.client.send({cmd: 'SET'}, 'w3resource redis');
    }
    // async setHello(){
    //     return this.client.send({cmd: 'SET'}, 'w3resource redis');
    // }

    async getHello(){
        return this.client.send({cmd: 'greeting'}, 'Progressive Coder');
    }

    async getHelloAsync() {
        const message = await this.client.send({cmd: 'greeting-async'}, 'Progressive Coder');
        return message;
    }

    async publishEvent() {
        this.client.emit('book-created', {'bookName': 'The Way Of Kings', 'author': 'Brandon Sanderson'});
    }
}