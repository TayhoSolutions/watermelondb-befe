import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({
        description: "User email address",
        example: "user@example.com",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "User password (minimum 6 characters)",
        example: "password123",
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: "User name (optional)",
        example: "John Doe",
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;
}
