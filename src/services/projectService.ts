import {
  Client,
  Invoice,
  NewProject,
  Project,
  newProjectSchema,
} from "../types/models";

import { Prisma } from "@prisma/client";
import { db } from "../../prisma/index";
import { isEmpty } from "lodash";
import { z } from "zod";

/**
 * Creates a new project in the database
 * @param {NewProject} project - The project data to create
 * @returns {Promise<Project>} The created project
 * @throws {Error} If project data is invalid or a project with same name exists
 */
export const createProject = async (project: NewProject): Promise<Project> => {
  try {
    const validatedProject = newProjectSchema.parse(project);
    return await db.project.create({
      data: validatedProject,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid project data: ${error.message}`);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A project with this name already exists");
      }
    }
    throw error;
  }
};

/**
 * Retrieves a project by its ID
 * @param {Project["id"]} projectId - The ID of the project to retrieve
 * @returns {Promise<Project>} The found project
 * @throws {Error} If no project is found with the given ID
 */
export const getProjectById = async (
  projectId: Project["id"]
): Promise<Project> => {
  return await db.project.findUniqueOrThrow({ where: { id: projectId } });
};

/**
 * Gets all projects associated with a client
 * @param {Client["id"]} clientId - The ID of the client
 * @returns {Promise<Project[]>} Array of projects belonging to the client
 * @throws {Error} If client is not found or no projects exist for the client
 */
export const getProjectsByClientId = async (
  clientId: Client["id"]
): Promise<Project[]> => {
  // First check if client exists
  const client = await db.client.findFirst({ where: { id: clientId } });
  if (!client) {
    throw new Error("Client not found");
  }

  const projects = await db.project.findMany({ where: { clientId } });
  if (isEmpty(projects)) {
    throw new Error("No projects found for that client");
  }

  return projects;
};

/**
 * Retrieves a project associated with a specific invoice
 * @param {Invoice["id"]} invoiceId - The ID of the invoice
 * @returns {Promise<Project>} The project associated with the invoice
 * @throws {Error} If no project is found for the invoice or if invoice not found
 */
export const getProjectByInvoiceID = async (
  invoiceId: Invoice["id"]
): Promise<Project> => {
  const invoice = await db.invoice.findFirst({ where: { id: invoiceId } });

  if (!invoice) {
    throw new Error("Invoice not found");
  }
  const project = await db.project.findFirst({
    where: { invoices: { some: { id: invoiceId } } },
  });
  if (!project) {
    throw new Error("No project found for that invoice");
  }
  return project;
};

/**
 * Retrieves all projects from the database
 * @returns {Promise<Project[]>} Array of all projects
 * @throws {Error} If no projects exist in the database
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const projects = await db.project.findMany();
  if (isEmpty(projects)) {
    throw new Error("No projects found");
  }
  return projects;
};

/**
 * Updates a project's information by its ID
 * @param {Project["id"]} projectId - The ID of the project to update
 * @param {NewProject} project - The new project data
 * @returns {Promise<Project>} The updated project
 */
export const updateProjectById = async (
  projectId: Project["id"],
  project: Partial<NewProject>
): Promise<Project> => {
  return await db.project.update({ where: { id: projectId }, data: project });
};

/**
 * Sets the end date of a project to the current date
 * @param {Project["id"]} projectId - The ID of the project to end
 * @returns {Promise<Project>} The updated project with end date set
 * @throws {Error} If no project is found with the given ID
 */
export const endProjectById = async (
  projectId: Project["id"]
): Promise<Project> => {
  return await db.project.update({
    where: { id: projectId },
    data: { endDate: new Date() },
  });
};

/**
 * Archives a project and all its associated invoices
 * @param {Project} project - The project to archive
 * @returns {Promise<Project>} The archived project
 */
export const archiveProject = async (project: Project): Promise<Project> => {
  const archiveInvoices = db.invoice.updateMany({
    where: { projectId: project.id },
    data: { isArchived: true, archivedAt: new Date() },
  });
  const archiveProject = db.project.update({
    where: { id: project.id },
    data: { isArchived: true, archivedAt: new Date() },
  });
  await db.$transaction([archiveInvoices, archiveProject]);
  return archiveProject;
};

/**
 * Archives a project and all its associated invoices by project ID
 * @param {Project["id"]} projectId - The ID of the project to archive
 * @returns {Promise<Project>} The archived project
 */
export const archiveProjectById = async (
  projectId: Project["id"]
): Promise<Project> => {
  const archiveInvoices = db.invoice.updateMany({
    where: { projectId: projectId },
    data: { isArchived: true, archivedAt: new Date() },
  });
  const archiveProject = db.project.update({
    where: { id: projectId },
    data: { isArchived: true, archivedAt: new Date() },
  });
  await db.$transaction([archiveInvoices, archiveProject]);
  return archiveProject;
};
