import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
