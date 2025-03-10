import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

import { clients } from "./clients";
import { projects } from "./projects";

export const invoices = sqliteTable("invoices_table", {
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
  clientId: integer("client_id").references(() => clients.id),
  projectId: integer("project_id").references(() => projects.id),
});

export const invoiceRelations = relations(invoices, ({ one }) => ({
  client: one(clients),
}));
