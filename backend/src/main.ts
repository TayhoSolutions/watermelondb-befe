import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
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

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle("WatermelonDB Sync API")
        .setDescription("API for mobile app synchronization with WatermelonDB")
        .setVersion("1.0")
        .addTag("Authentication", "User authentication endpoints")
        .addTag("Users", "User management endpoints")
        .addTag("Sync", "WatermelonDB sync protocol endpoints")
        .addTag("Health", "Application health check")
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                name: "JWT",
                description: "Enter JWT access token",
                in: "header",
            },
            "access-token"
        )
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                name: "JWT Refresh",
                description: "Enter JWT refresh token",
                in: "header",
            },
            "refresh-token"
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
    console.log(`📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
