import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { client } from "./clients";
import { sql } from "drizzle-orm";

export const project = sqliteTable("companies_table", {
  id: int().primaryKey({ autoIncrement: true }),
  projectName: text().notNull(),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  archivedAt: integer({ mode: "timestamp_ms" }),
  isArchived: integer({ mode: "boolean" }).notNull().default(false),
  clientId: integer().references(() => client.id),
});
