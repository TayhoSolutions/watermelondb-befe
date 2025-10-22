import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOperation({ summary: "Create a new user" })
    @ApiResponse({ status: 201, description: "User successfully created" })
    @ApiResponse({ status: 400, description: "Bad request - validation failed" })
    @ApiResponse({ status: 409, description: "User already exists" })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("access-token")
    @Get()
    @ApiOperation({ summary: "Get all users (protected)" })
    @ApiResponse({ status: 200, description: "List of all users" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("access-token")
    @Get("me")
    @ApiOperation({ summary: "Get current user profile (protected)" })
    @ApiResponse({ status: 200, description: "Current user profile" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    getProfile(@Request() req) {
        return this.usersService.findOne(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("access-token")
    @Get(":id")
    @ApiOperation({ summary: "Get user by ID (protected)" })
    @ApiParam({ name: "id", description: "User ID" })
    @ApiResponse({ status: 200, description: "User details" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "User not found" })
    findOne(@Param("id") id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("access-token")
    @Patch(":id")
    @ApiOperation({ summary: "Update user by ID (protected)" })
    @ApiParam({ name: "id", description: "User ID" })
    @ApiResponse({ status: 200, description: "User successfully updated" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "User not found" })
    update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth("access-token")
    @Delete(":id")
    @ApiOperation({ summary: "Delete user by ID (protected)" })
    @ApiParam({ name: "id", description: "User ID" })
    @ApiResponse({ status: 200, description: "User successfully deleted" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "User not found" })
    remove(@Param("id") id: string) {
        return this.usersService.remove(id);
    }
}
