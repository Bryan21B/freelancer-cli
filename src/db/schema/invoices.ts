import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { client } from "./clients";
import { project } from "./projects";
import { sql } from "drizzle-orm";

export const invoice = sqliteTable("invoices_table", {
  id: int().primaryKey({ autoIncrement: true }),
  totalCost: int().notNull(),
  dueDate: integer({ mode: "timestamp_ms" }).notNull(),
  status: text({ enum: ["DRAFT", "VALIDATED", "PAID", "ARCHIVED"] }).notNull(),
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  validatedAt: integer({ mode: "boolean" }),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date()),
  archivedAt: integer({ mode: "timestamp_ms" }),
  isArchived: integer({ mode: "boolean" }).notNull().default(false),
  clientId: integer().references(() => client.id),
  projectId: integer().references(() => project.id),
});
