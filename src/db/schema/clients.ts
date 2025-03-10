import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

import { invoice } from "./invoices";
import { project } from "./projects";

export const client = sqliteTable("clients_table", {
  id: int().primaryKey({ autoIncrement: true }),
  firstName: text().notNull(),
  lastName: text().notNull(),
  companyName: text().notNull(),
  email: text().unique(),
  address_street: text(),
  address_city: text(),
  address_zip: text(),
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

export const clientRelations = relations(client, ({ many }) => ({
  projects: many(project),
  invoices: many(invoice),
}));
