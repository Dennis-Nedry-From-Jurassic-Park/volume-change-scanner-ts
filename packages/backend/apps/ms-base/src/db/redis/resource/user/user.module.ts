import {CacheModule, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {RedisCacheModule} from "../../shared/resource/redis-cache/redis-cache.module";
import {REDIS_CACHE_OPTIONS} from "../../infra/redis/redis.config";

@Module({
  imports: [
      CacheModule.register({
          ...REDIS_CACHE_OPTIONS
      }),
     RedisCacheModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
