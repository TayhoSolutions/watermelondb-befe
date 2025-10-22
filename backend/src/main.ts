import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { SwaggerSetup } from "./swaggerSetup";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    // Use NestExpressApplication for Express-specific features
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

    if (process.env.NODE_ENV === "development") {
        SwaggerSetup(app, apiPrefix);
        console.log(`📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`);
    }

    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
