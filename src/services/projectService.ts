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

export const getProjectById = async (
  projectId: Project["id"]
): Promise<Project> => {
  return await db.project.findUniqueOrThrow({ where: { id: projectId } });
};

export const getProjectsByClientId = async (
  clientId: Client["id"]
): Promise<Project[]> => {
  const projects = await db.project.findMany({ where: { clientId: clientId } });
  if (!projects) {
    throw new Error("No projects found for that client");
  }
  return projects;
};

export const getProjectByInvoiceID = async (
  invoiceId: Invoice["id"]
): Promise<Project> => {
  const project = await db.project.findFirstOrThrow({
    where: { invoices: { some: { id: invoiceId } } },
  });
  if (!project) {
    throw new Error("No project found for that invoice");
  }
  return project;
};

export const getAllProjects = async (): Promise<Project[]> => {
  const projects = await db.project.findMany();
  if (isEmpty(projects)) {
    throw new Error("No projects found");
  }
  return projects;
};

export const updateProjectById = async (
  projectId: Project["id"],
  project: NewProject
) => {
  return await db.project.update({ where: { id: projectId }, data: project });
};

export const endProject = async (project: Project): Promise<Project> => {
  return await db.project.update({
    where: { id: project.id },
    data: { endDate: new Date() },
  });
};

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
