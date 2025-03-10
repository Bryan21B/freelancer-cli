import { clients } from "../db/schema/clients.js";
import { invoices } from "../db/schema/invoices.js";
import { projects } from "../db/schema/projects.js";

export type DBClient = typeof clients.$inferInsert;
export type DBProject = typeof projects.$inferInsert;
export type DBInvoice = typeof invoices.$inferInsert;
