import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const companiesTable = sqliteTable("companies_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});
