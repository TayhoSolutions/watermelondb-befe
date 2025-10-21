import { IsNumber, IsNotEmpty, IsOptional, IsObject } from "class-validator";

export class PullDto {
    @IsNumber()
    @IsNotEmpty()
    lastPulledAt: number;

    @IsNumber()
    @IsNotEmpty()
    schemaVersion: number;

    @IsObject()
    @IsOptional()
    migration?: any;
}
