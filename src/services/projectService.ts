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
 * Retrieves non-archived projects for a client, optionally filtering for active projects only
 * @param {Client["id"]} clientId - The ID of the client
 * @param {boolean} activeOnly - If true, returns only active projects (no end date)
 * @param {boolean} includeArchived - Whether to include archived projects
 * @returns {Promise<Project[]>} Array of matching projects
 * @throws {Error} If no matching projects are found
 */
export const getClientProjects = async (
  clientId: Client["id"],
  activeOnly = false,
  includeArchived = false
): Promise<Project[]> => {
  // Build the where clause for the database query
  const where = {
    clientId,
    // Only include isArchived filter if we're not including archived projects
    ...(includeArchived ? {} : { isArchived: false }),
    // Only include endDate filter if activeOnly is true
    ...(activeOnly && { endDate: null }),
  };

  // Query the database for matching projects
  const projects = await db.project.findMany({ where });

  // If no projects found at all, throw appropriate error based on activeOnly flag
  if (isEmpty(projects)) {
    throw new Error(
      activeOnly ? "No active projects found" : "No projects found"
    );
  }

  // Additional validation when activeOnly is true:
  // Even though we filtered in the query, double check that no projects
  // have an end date (defensive programming)
  if (activeOnly && projects.some((project) => project.endDate !== null)) {
    throw new Error("No active projects found");
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
 * @param {Project["id"]} projectId - The ID of the project to archive
 * @returns {Promise<Project>} The archived project
 * @throws {Error} If no project is found with the given ID
 */
export const archiveProjectById = async (
  projectId: Project["id"]
): Promise<Project> => {
  const project = await db.project.findUniqueOrThrow({
    where: { id: projectId },
  });

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
 * Retrieves a project associated with a specific invoice
 * @param {Invoice["id"]} invoiceId - The ID of the invoice
 * @returns {Promise<Project>} The project associated with the invoice
 * @throws {Error} If no project is found for the invoice or if invoice not found
 */
export const getProjectByInvoiceId = async (
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
