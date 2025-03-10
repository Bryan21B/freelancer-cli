import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

import { client } from "./clients";
import { invoice } from "./invoices";

export const project = sqliteTable("projects_table", {
  id: int().primaryKey({ autoIncrement: true }),
  projectName: text().notNull(),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date()),
  archivedAt: integer({ mode: "timestamp_ms" }),
  isArchived: integer({ mode: "boolean" }).notNull().default(false),
  clientId: integer("client_id").references(() => client.id),
});

export const projectRelations = relations(project, ({ many, one }) => ({
  invoices: many(invoice),
  client: one(client),
}));
