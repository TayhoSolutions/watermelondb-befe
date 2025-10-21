import * as argon2 from "argon2";

import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "nestjs-prisma";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "@prisma/client";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException("User with this email already exists");
        }

        // Hash password with Argon2
        const hashedPassword = await argon2.hash(createUserDto.password);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
                name: createUserDto.name,
                lastModifiedAt: BigInt(Date.now()),
            },
        });

        return user;
    }

    async findAll(): Promise<Omit<User, "password" | "refreshToken">[]> {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                lastModifiedAt: true,
            },
        });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        await this.findOne(id); // Check if exists

        // If password is being updated, hash it
        const data: any = { ...updateUserDto };
        if (updateUserDto.password) {
            data.password = await argon2.hash(updateUserDto.password);
        }
        data.lastModifiedAt = BigInt(Date.now());

        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        const hashedToken = refreshToken ? await argon2.hash(refreshToken) : null;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                refreshToken: hashedToken,
                lastModifiedAt: BigInt(Date.now()),
            },
        });
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id); // Check if exists
        await this.prisma.user.delete({ where: { id } });
    }

    async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await argon2.verify(hashedPassword, plainPassword);
        } catch (error) {
            return false;
        }
    }
}
