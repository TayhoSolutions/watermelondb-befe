import { schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";

/**
 * Database Migrations
 *
 * Jedes Mal, wenn das Schema geändert wird, muss eine neue Migration hinzugefügt werden.
 * Die Version muss mit der Schema-Version übereinstimmen.
 *
 * @see https://watermelondb.dev/docs/Advanced/Migrations
 */
export default schemaMigrations({
    migrations: [
        // Migration von Version 0 (keine Datenbank) zu Version 1
        {
            toVersion: 2,
            steps: [
                // Bei der ersten Version sind keine Steps nötig,
                // da die Tabellen durch das Schema erstellt werden
            ],
        },
        // Zukünftige Migrations würden hier hinzugefügt werden:
        // {
        //   toVersion: 2,
        //   steps: [
        //     addColumns({
        //       table: 'projects',
        //       columns: [
        //         { name: 'color', type: 'string', isOptional: true },
        //       ],
        //     }),
        //   ],
        // },
    ],
});
