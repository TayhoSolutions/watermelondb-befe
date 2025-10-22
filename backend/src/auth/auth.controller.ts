import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto, RefreshTokenResponseDto } from "./dto/auth-response.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    @ApiOperation({ summary: "Register a new user" })
    @ApiResponse({
        status: 201,
        description: "User successfully registered",
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 400, description: "Bad request - validation failed" })
    @ApiResponse({ status: 409, description: "User already exists" })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("login")
    @ApiOperation({ summary: "Login with email and password" })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: "User successfully logged in",
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: "Invalid credentials" })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtRefreshGuard)
    @HttpCode(HttpStatus.OK)
    @Post("refresh")
    @ApiBearerAuth("refresh-token")
    @ApiOperation({ summary: "Refresh access token using refresh token" })
    @ApiResponse({
        status: 200,
        description: "Tokens successfully refreshed",
        type: RefreshTokenResponseDto,
    })
    @ApiResponse({ status: 401, description: "Invalid or expired refresh token" })
    async refreshTokens(@Request() req): Promise<RefreshTokenResponseDto> {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("logout")
    @ApiBearerAuth()
    @ApiOperation({ summary: "Logout and invalidate refresh token" })
    @ApiResponse({ status: 200, description: "User successfully logged out" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    async logout(@Request() req) {
        await this.authService.logout(req.user.sub);
        return { message: "Logged out successfully" };
    }
}
