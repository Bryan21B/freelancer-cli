import { Client, Invoice, Project } from "@prisma/client";

import { createClientData } from "./clientFactory";
import { createInvoiceData } from "./invoiceFactory";
import { createProjectData } from "./projectFactory";
import { db } from "../../prisma";
import { onTestFinished } from "vitest";

/**
 * Sets up automatic database cleanup after test completion.
 * This function should be called at the start of each test that modifies the database.
 */
export const setupTestDb = () => {
  onTestFinished(async () => {
    // Clean all tables and reset Prismock's state
    await Promise.all([
      db.invoice.deleteMany(),
      db.project.deleteMany(),
      db.client.deleteMany(),
    ]);

    // @ts-expect-error - Prismock specific method
    db.reset();
  });
};

/**
 * Creates a test client with associated projects and invoices.
 * This utility function helps set up test data with related entities.
 * @returns {Promise<{client: Client, project: Project, invoices: Invoice[]}>} The created test data
 */
export const createClientWithInvoicesAndProjects = async (): Promise<{
  client: Client;
  project: Project;
  invoices: Invoice[];
}> => {
  const client = await db.client.create({ data: createClientData() });
  const project = await db.project.create({ data: createProjectData() });
  const invoices = await db.invoice.createManyAndReturn({
    data: [createInvoiceData(), createInvoiceData(), createInvoiceData()],
  });
  return { client, project, invoices };
};
