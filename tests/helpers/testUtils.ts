import { Client, Invoice, Project } from "@prisma/client";

import { NewProject } from "../../src/types/models";
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
  const project = await db.project.create({
    data: createProjectData({ name: "Test Project 1" }),
  });
  const invoices = await db.invoice.createManyAndReturn({
    data: [createInvoiceData(), createInvoiceData(), createInvoiceData()],
  });
  return { client, project, invoices };
};

/**
 * Creates multiple test projects with sequential names for a given client.
 * This utility function helps set up test data by creating a specified number of projects.
 * @param {number} numberOfProjects - The number of projects to create (defaults to 3)
 * @param {Client["id"]} clientId - The ID of the client to associate projects with (defaults to 1)
 * @returns {Promise<Array<NewProject>>} Array of created test projects
 */
export const createProjects = async (
  numberOfProjects: number = 3,
  clientId: Client["id"] = 1
) => {
  let projects: Array<NewProject> = [];
  for (let index = 1; index <= numberOfProjects; index++) {
    const name = "Test Project " + (index + 1);
    projects.push(createProjectData({ name, clientId }));
  }
  projects = await db.project.createManyAndReturn({ data: projects });
  return projects;
};
