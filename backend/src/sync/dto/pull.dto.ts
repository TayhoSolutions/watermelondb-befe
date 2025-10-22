import { IsNumber, IsNotEmpty, IsOptional, IsObject } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PullDto {
    @ApiProperty({
        description: "Timestamp of last pull (in milliseconds)",
        example: 1705752000000,
    })
    @IsNumber()
    @IsNotEmpty()
    lastPulledAt: number;

    @ApiProperty({
        description: "WatermelonDB schema version",
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    schemaVersion: number;

    @ApiProperty({
        description: "Migration data (optional)",
        required: false,
        example: null,
    })
    @IsObject()
    @IsOptional()
    migration?: any;
}
