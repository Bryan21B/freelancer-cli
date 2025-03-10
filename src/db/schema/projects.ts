import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

import { clients } from "./clients";
import { invoices } from "./invoices";

export const projects = sqliteTable("projects_table", {
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
  clientId: integer("client_id").references(() => clients.id),
});

export const projectRelations = relations(projects, ({ many, one }) => ({
  invoices: many(invoices),
  client: one(clients),
}));
