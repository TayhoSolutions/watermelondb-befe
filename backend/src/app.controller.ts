import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppService } from "./app.service";

@ApiTags("Health")
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiOperation({ summary: "Get welcome message" })
    @ApiResponse({ status: 200, description: "Welcome message" })
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("health")
    @ApiOperation({ summary: "Health check endpoint" })
    @ApiResponse({ status: 200, description: "Service is healthy" })
    healthCheck() {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            service: "WatermelonDB Sync Backend",
        };
    }
}
