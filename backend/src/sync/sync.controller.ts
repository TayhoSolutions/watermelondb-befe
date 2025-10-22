import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SyncService } from "./sync.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PullDto } from "./dto/pull.dto";
import { PushDto } from "./dto/push.dto";

@ApiTags("Sync")
@Controller("sync")
@UseGuards(JwtAuthGuard)
export class SyncController {
    constructor(private readonly syncService: SyncService) {}

    @Post("pull")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("access-token")
    @ApiOperation({ summary: "Pull changes from server (WatermelonDB Sync Protocol)" })
    @ApiResponse({ status: 200, description: "Changes successfully retrieved" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async pull(@Request() req, @Body() pullDto: PullDto) {
        const userId = req.user.id;
        return this.syncService.pullChanges(userId, pullDto.lastPulledAt, pullDto.schemaVersion, pullDto.migration);
    }

    @Post("push")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth("access-token")
    @ApiOperation({ summary: "Push local changes to server (WatermelonDB Sync Protocol)" })
    @ApiResponse({ status: 200, description: "Changes successfully pushed" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async push(@Request() req, @Body() pushDto: PushDto) {
        const userId = req.user.id;
        await this.syncService.pushChanges(userId, pushDto.changes);
        return { success: true };
    }
}
