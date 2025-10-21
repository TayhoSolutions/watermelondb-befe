import { Model, Relation } from "@nozbe/watermelondb";
import { date, field, readonly, relation } from "@nozbe/watermelondb/decorators";

import Project from "./Project";

export default class Task extends Model {
    static table = "tasks";
    static associations = {
        projects: { type: "belongs_to" as const, key: "project_id" },
    };

    @field("title") title!: string;
    @field("description") description!: string;
    @field("is_completed") isCompleted!: boolean;
    @field("project_id") projectId!: string;
    @readonly @date("created_at") createdAt!: Date;
    @readonly @date("updated_at") updatedAt!: Date;
    @relation("projects", "project_id") project!: Relation<Project>;
}
