import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";

import { INestApplication } from "@nestjs/common";

export const SwaggerSetup = (app: INestApplication, apiPrefix: string) => {
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

    // Function to sort tags alphabetically
    const sortTagsAlphabetically = (document: OpenAPIObject) => {
        if (document.tags) {
            document.tags.sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
    };

    // Sort the tags in the Swagger document
    sortTagsAlphabetically(document);

    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: "alpha",
            apisSorter: "alpha",
            operationsSorter: "alpha",
        },
        explorer: true,
    });
};
