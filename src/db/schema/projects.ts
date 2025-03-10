import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base.js";
import { clients } from "./clients.js";
import { invoices } from "./invoices.js";
import { relations } from "drizzle-orm";

export const projects = sqliteTable("projects_table", {
  ...baseFields,
  name: text("name").notNull(),
  description: text("description"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }),
  clientId: integer("client_id").references(() => clients.id),
});

export const projectRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  invoices: many(invoices),
}));
