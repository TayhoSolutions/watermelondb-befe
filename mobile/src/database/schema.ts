import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "projects",
            columns: [
                { name: "name", type: "string" },
                { name: "description", type: "string", isOptional: true },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
            ],
        }),
        tableSchema({
            name: "tasks",
            columns: [
                { name: "title", type: "string" },
                { name: "description", type: "string", isOptional: true },
                { name: "is_completed", type: "boolean" },
                { name: "project_id", type: "string", isIndexed: true },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
            ],
        }),
    ],
});
