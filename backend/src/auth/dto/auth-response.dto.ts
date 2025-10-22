import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({
        description: "The unique identifier of the user",
        example: "cm6j3n4pa0000pn4n8eqj0kze",
    })
    id: string;

    @ApiProperty({
        description: "The email address of the user",
        example: "user@example.com",
    })
    email: string;

    @ApiProperty({
        description: "The name of the user",
        example: "John Doe",
        required: false,
    })
    name?: string;

    @ApiProperty({
        description: "The timestamp when the user was created",
        example: "2024-01-20T10:30:00.000Z",
    })
    createdAt: Date;

    @ApiProperty({
        description: "The timestamp when the user was last updated",
        example: "2024-01-20T10:30:00.000Z",
    })
    updatedAt: Date;
}

export class AuthResponseDto {
    @ApiProperty({
        description: "JWT access token (expires in 15 minutes)",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    accessToken: string;

    @ApiProperty({
        description: "JWT refresh token (expires in 7 days)",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    refreshToken: string;

    @ApiProperty({
        description: "User information",
        type: UserDto,
    })
    user: UserDto;
}

export class RefreshTokenResponseDto {
    @ApiProperty({
        description: "New JWT access token (expires in 15 minutes)",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    accessToken: string;

    @ApiProperty({
        description: "New JWT refresh token (expires in 7 days)",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    refreshToken: string;
}
