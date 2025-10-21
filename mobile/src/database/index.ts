import { Database } from "@nozbe/watermelondb";
import Project from "../model/Project";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import Task from "../model/Task";
import migrations from "./migrations";
import { schema } from "./schema";

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    dbName: "watermelondb",
    jsi: true,
    onSetUpError: (error) => {
        console.error("Database setup error:", error);
    },
});

export const database = new Database({
    adapter,
    modelClasses: [Project, Task],
});
