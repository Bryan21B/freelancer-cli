import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

import { invoices } from "./invoices";
import { projects } from "./projects";

export const clients = sqliteTable("clients_table", {
  id: int().primaryKey({ autoIncrement: true }),
  firstName: text().notNull(),
  lastName: text().notNull(),
  companyName: text().notNull(),
  email: text().unique(),
  addressStreet: text(),
  addressCity: text(),
  addressZip: text(),
  phoneCountryCode: text(),
  phoneNumber: text(),
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date()),
  archivedAt: integer({ mode: "timestamp_ms" }),
  isArchived: integer({ mode: "boolean" }).notNull().default(false),
});

export const clientRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
  invoices: many(invoices),
}));
