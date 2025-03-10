import "dotenv/config";

import { DBClient, DBInvoice, DBProject } from "../types/db_types";

import { clients } from "./schema/clients";
import { drizzle } from "drizzle-orm/libsql";
import { invoices } from "./schema/invoices";
import { projects } from "./schema/projects";

export const db = drizzle({
  connection: process.env.DB_FILE_NAME!,
});

export const insertClient = async (client: DBClient) => {
  return db.insert(clients).values(client).returning();
};

export const insertProject = async (project: DBProject) => {
  return db.insert(projects).values(project).returning();
};

export const insertInvoice = async (invoice: DBInvoice) => {
  return db.insert(invoices).values(invoice).returning();
};

// const newClient: Client = {
//   firstName: "Bryan",
//   lastName: "Blanchot",
//   companyName: "Bryan Blanchot",
//   email: "bryan.blanchot@gmail.com",
// };

// const client = await insertClient(newClient);
// const [newClientData] = client;
// console.debug(client);

// const newProject: Project = {
//   name: "New Project",
//   clientId: newClientData.id,
//   startDate: new Date(),
// };

// const project = await insertProject(newProject);
// console.log(project);

// Delete in correct order (projects first, then clients)
// await db.delete(projects);
// await db.delete(clients);
