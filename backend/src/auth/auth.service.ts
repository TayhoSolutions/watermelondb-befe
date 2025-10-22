import { Injectable, UnauthorizedException } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto, RefreshTokenResponseDto } from "./dto/auth-response.dto";
import { UsersService } from "../users/users.service";

export interface JwtPayload {
    sub: string;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            return null;
        }

        const isPasswordValid = await this.usersService.verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        const { password: _, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const user = await this.usersService.create(registerDto);
        const tokens = await this.generateTokens(user.id, user.email);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<RefreshTokenResponseDto> {
        const user = await this.usersService.findOne(userId);

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException("Access Denied");
        }

        const refreshTokenMatches = await this.usersService.verifyPassword(refreshToken, user.refreshToken);

        if (!refreshTokenMatches) {
            throw new UnauthorizedException("Access Denied");
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string): Promise<void> {
        await this.usersService.updateRefreshToken(userId, null);
    }

    private async generateTokens(userId: string, email: string): Promise<RefreshTokenResponseDto> {
        const payload: JwtPayload = { sub: userId, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("JWT_SECRET"),
                expiresIn: this.configService.get("JWT_EXPIRES_IN") || "15m",
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
                expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN") || "7d",
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
