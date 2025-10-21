import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule } from "@nestjs/config";
import KeyvRedis from "@keyv/redis";
import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { SyncModule } from "./sync/sync.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),

        // Prisma Database
        PrismaModule.forRoot({
            isGlobal: true,
        }),

        // Redis Cache (cache-manager v6 with Keyv)
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => {
                const redisHost = process.env.REDIS_HOST || "localhost";
                const redisPort = process.env.REDIS_PORT || "6379";
                const redisPassword = process.env.REDIS_PASSWORD;
                const redisDb = process.env.REDIS_DB || "0";

                // Build Redis connection URL for Keyv
                const redisUrl = redisPassword
                    ? `redis://:${redisPassword}@${redisHost}:${redisPort}/${redisDb}`
                    : `redis://${redisHost}:${redisPort}/${redisDb}`;

                return {
                    stores: [new KeyvRedis(redisUrl)],
                    ttl: 300000, // 5 minutes (now in milliseconds)
                };
            },
        }),

        // Feature Modules
        AuthModule,
        UsersModule,
        SyncModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
