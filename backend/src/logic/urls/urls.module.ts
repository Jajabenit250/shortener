import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { UrlsController } from "./urls.controller";
import { UrlsService } from "./urls.service";
import { Url } from "src/database/entities/url.entity";
import { ThrottlerModule } from "@nestjs/throttler";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Url]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // time-to-live in milliseconds
          limit: 10, // maximum number of requests within ttl
        },
      ],
    }),
    CacheModule.register({
      ttl: 3600, // Default cache TTL (1 hour)
      max: 1000, // Maximum number of items in cache
      isGlobal: false, // Scope to this module
    }),
  ],
  controllers: [UrlsController],
  providers: [UrlsService, ConfigService],
  exports: [UrlsService],
})
export class UrlsModule {}
