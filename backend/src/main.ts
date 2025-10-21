import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
    // Use NestExpressApplication for Express v5 configuration
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Configure Express v5 query parser to support nested objects (like Express v4)
    // This is needed for complex query strings like: ?filter[where][name]=John
    app.set("query parser", "extended");

    // Get config service
    const configService = app.get(ConfigService);
    const port = configService.get<number>("PORT", 3000);
    const apiPrefix = configService.get<string>("API_PREFIX", "api");

    // Enable CORS for mobile app
    app.enableCors({
        origin: true, // In production, specify exact origins
        credentials: true,
    });

    // Global API prefix
    app.setGlobalPrefix(apiPrefix);

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );

    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
