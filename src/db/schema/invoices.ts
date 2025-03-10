import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base";
import { clients } from "./clients";
import { projects } from "./projects";
import { relations } from "drizzle-orm";

export const invoices = sqliteTable("invoices_table", {
  ...baseFields,
  totalCost: integer("total_cost").notNull(),
  dueDate: integer("due_date", { mode: "timestamp_ms" }).notNull(),
  status: text("status", {
    enum: ["DRAFT", "VALIDATED", "PAID", "ARCHIVED"],
  }).notNull(),
  validatedAt: integer("validated_at", { mode: "timestamp_ms" }),
  clientId: integer("client_id").references(() => clients.id),
  projectId: integer("project_id").references(() => projects.id),
});

export const invoiceRelations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [invoices.projectId],
    references: [projects.id],
  }),
}));
