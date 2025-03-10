import { integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const baseFields = {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => new Date()),
  archivedAt: integer("archived_at", { mode: "timestamp_ms" }),
  isArchived: integer("is_archived", { mode: "boolean" })
    .notNull()
    .default(false),
};
