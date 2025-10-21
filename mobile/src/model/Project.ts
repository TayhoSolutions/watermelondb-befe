import { children, date, field, readonly } from "@nozbe/watermelondb/decorators";

import { Model } from "@nozbe/watermelondb";
import Task from "./Task";

export default class Project extends Model {
    static table = "projects";
    static associations = {
        tasks: { type: "has_many" as const, foreignKey: "project_id" },
    };

    @field("name") name!: string;
    @field("description") description!: string;
    @readonly @date("created_at") createdAt!: Date;
    @readonly @date("updated_at") updatedAt!: Date;
    @children("tasks") tasks!: Task[];
}
