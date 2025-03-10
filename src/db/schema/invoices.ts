import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { client } from "./clients";
import { sql } from "drizzle-orm";

export const invoice = sqliteTable("companies_table", {
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
    .default(sql`(CURRENT_TIMESTAMP)`),
  archivedAt: integer({ mode: "timestamp_ms" }),
  isArchived: integer({ mode: "boolean" }).notNull().default(false),
  clientId: integer().references(() => client.id),
});
