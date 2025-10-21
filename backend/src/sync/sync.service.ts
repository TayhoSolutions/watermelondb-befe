import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface SyncChanges {
    projects: {
        created: any[];
        updated: any[];
        deleted: string[];
    };
    tasks: {
        created: any[];
        updated: any[];
        deleted: string[];
    };
}

export interface SyncPullResponse {
    changes: {
        projects: { created: any[]; updated: any[]; deleted: string[] };
        tasks: { created: any[]; updated: any[]; deleted: string[] };
    };
    timestamp: number;
}

@Injectable()
export class SyncService {
    constructor(private prisma: PrismaService) {}

    /**
     * Pull changes from server since lastPulledAt timestamp
     */
    async pullChanges(userId: string, lastPulledAt: number): Promise<SyncPullResponse> {
        const timestamp = Date.now();

        // Fetch projects changed after lastPulledAt
        const projects = await this.prisma.project.findMany({
            where: {
                userId,
                updatedAtMs: {
                    gt: BigInt(lastPulledAt),
                },
            },
        });

        // Fetch tasks changed after lastPulledAt
        const tasks = await this.prisma.task.findMany({
            where: {
                userId,
                updatedAtMs: {
                    gt: BigInt(lastPulledAt),
                },
            },
        });

        // Separate into created, updated, and deleted
        const projectsCreated = projects.filter((p) => Number(p.createdAtMs) > lastPulledAt && !p.isDeleted);
        const projectsUpdated = projects.filter((p) => Number(p.createdAtMs) <= lastPulledAt && !p.isDeleted);
        const projectsDeleted = projects.filter((p) => p.isDeleted).map((p) => p.id);

        const tasksCreated = tasks.filter((t) => Number(t.createdAtMs) > lastPulledAt && !t.isDeleted);
        const tasksUpdated = tasks.filter((t) => Number(t.createdAtMs) <= lastPulledAt && !t.isDeleted);
        const tasksDeleted = tasks.filter((t) => t.isDeleted).map((t) => t.id);

        return {
            changes: {
                projects: {
                    created: projectsCreated.map(this.transformProjectForClient),
                    updated: projectsUpdated.map(this.transformProjectForClient),
                    deleted: projectsDeleted,
                },
                tasks: {
                    created: tasksCreated.map(this.transformTaskForClient),
                    updated: tasksUpdated.map(this.transformTaskForClient),
                    deleted: tasksDeleted,
                },
            },
            timestamp,
        };
    }

    /**
     * Push changes from client to server
     */
    async pushChanges(userId: string, changes: SyncChanges): Promise<void> {
        const currentTime = BigInt(Date.now());

        // Process Projects
        if (changes.projects.created.length > 0) {
            for (const project of changes.projects.created) {
                const exists = await this.prisma.project.findUnique({ where: { id: project.id } });
                if (!exists) {
                    await this.prisma.project.create({
                        data: {
                            id: project.id,
                            name: project.name,
                            description: project.description,
                            userId,
                            createdAtMs: BigInt(project.created_at || Date.now()),
                            updatedAtMs: BigInt(project.updated_at || Date.now()),
                            isDeleted: false,
                        },
                    });
                }
            }
        }

        if (changes.projects.updated.length > 0) {
            for (const project of changes.projects.updated) {
                await this.prisma.project.updateMany({
                    where: { id: project.id, userId },
                    data: {
                        name: project.name,
                        description: project.description,
                        updatedAtMs: BigInt(project.updated_at || Date.now()),
                    },
                });
            }
        }

        if (changes.projects.deleted.length > 0) {
            for (const projectId of changes.projects.deleted) {
                await this.prisma.project.updateMany({
                    where: { id: projectId, userId },
                    data: {
                        isDeleted: true,
                        updatedAtMs: currentTime,
                    },
                });
            }
        }

        // Process Tasks
        if (changes.tasks.created.length > 0) {
            for (const task of changes.tasks.created) {
                const exists = await this.prisma.task.findUnique({ where: { id: task.id } });
                if (!exists) {
                    await this.prisma.task.create({
                        data: {
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            isCompleted: task.is_completed || false,
                            projectId: task.project_id,
                            userId,
                            createdAtMs: BigInt(task.created_at || Date.now()),
                            updatedAtMs: BigInt(task.updated_at || Date.now()),
                            isDeleted: false,
                        },
                    });
                }
            }
        }

        if (changes.tasks.updated.length > 0) {
            for (const task of changes.tasks.updated) {
                await this.prisma.task.updateMany({
                    where: { id: task.id, userId },
                    data: {
                        title: task.title,
                        description: task.description,
                        isCompleted: task.is_completed,
                        projectId: task.project_id,
                        updatedAtMs: BigInt(task.updated_at || Date.now()),
                    },
                });
            }
        }

        if (changes.tasks.deleted.length > 0) {
            for (const taskId of changes.tasks.deleted) {
                await this.prisma.task.updateMany({
                    where: { id: taskId, userId },
                    data: {
                        isDeleted: true,
                        updatedAtMs: currentTime,
                    },
                });
            }
        }
    }

    /**
     * Transform server entity to WatermelonDB format
     */
    private transformProjectForClient(project: any): any {
        return {
            id: project.id,
            name: project.name,
            description: project.description,
            created_at: Number(project.createdAtMs),
            updated_at: Number(project.updatedAtMs),
        };
    }

    private transformTaskForClient(task: any): any {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            is_completed: task.isCompleted,
            project_id: task.projectId,
            created_at: Number(task.createdAtMs),
            updated_at: Number(task.updatedAtMs),
        };
    }
}
