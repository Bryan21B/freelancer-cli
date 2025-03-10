import { clients } from "../db/schema/clients";
import { invoices } from "../db/schema/invoices";
import { projects } from "../db/schema/projects";

export type DBClient = typeof clients.$inferInsert;
export type DBProject = typeof projects.$inferInsert;
export type DBInvoice = typeof invoices.$inferInsert;
