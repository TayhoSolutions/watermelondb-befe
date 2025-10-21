import { IsNumber, IsNotEmpty } from "class-validator";

export class PullDto {
    @IsNumber()
    @IsNotEmpty()
    lastPulledAt: number;
}
