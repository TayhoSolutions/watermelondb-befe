import { Module } from "@nestjs/common";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";

@Module({
    controllers: [SyncController],
    providers: [SyncService],
    exports: [SyncService],
})
export class SyncModule {}
