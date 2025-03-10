import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { sql } from "drizzle-orm";

export const client = sqliteTable("companies_table", {
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
    .default(sql`(CURRENT_TIMESTAMP)`),
  archivedAt: integer({ mode: "timestamp_ms" }),
  isArchived: integer({ mode: "boolean" }).notNull().default(false),
});
