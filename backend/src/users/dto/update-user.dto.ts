import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({
        description: "User email address",
        example: "user@example.com",
        required: false,
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: "User password (minimum 6 characters)",
        example: "newPassword123",
        minLength: 6,
        required: false,
    })
    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @ApiProperty({
        description: "User name",
        example: "Jane Doe",
        required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: "User active status",
        example: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
