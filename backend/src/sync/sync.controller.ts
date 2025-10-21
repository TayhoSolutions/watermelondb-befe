import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { SyncService } from "./sync.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PullDto } from "./dto/pull.dto";
import { PushDto } from "./dto/push.dto";

@Controller("sync")
@UseGuards(JwtAuthGuard)
export class SyncController {
    constructor(private readonly syncService: SyncService) {}

    @Post("pull")
    @HttpCode(HttpStatus.OK)
    async pull(@Request() req, @Body() pullDto: PullDto) {
        const userId = req.user.id;
        return this.syncService.pullChanges(userId, pullDto.lastPulledAt);
    }

    @Post("push")
    @HttpCode(HttpStatus.OK)
    async push(@Request() req, @Body() pushDto: PushDto) {
        const userId = req.user.id;
        await this.syncService.pushChanges(userId, pushDto.changes);
        return { success: true };
    }
}
