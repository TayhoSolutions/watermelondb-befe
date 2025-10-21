import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "WatermelonDB Sync Backend API";
    }
}
