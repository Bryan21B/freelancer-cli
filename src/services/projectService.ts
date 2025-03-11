import { NewProject, Project, newProjectSchema } from "../types/models";

import { Prisma } from "@prisma/client";
import { db } from "../prisma/index";
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

export const updateProject = async (
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

export const archiveProject = async (project: Project): Promise<null> => {
  const archiveInvoices = db.invoice.updateMany({
    where: { projectId: project.id },
    data: { isArchived: true, archivedAt: new Date() },
  });
  const archiveProject = db.project.update({
    where: { id: project.id },
    data: { isArchived: true, archivedAt: new Date() },
  });
  await db.$transaction([archiveInvoices, archiveProject]);
  return null;
};

export const archiveProjectById = async (
  projectId: Project["id"]
): Promise<null> => {
  const archiveInvoices = db.invoice.updateMany({
    where: { projectId: projectId },
    data: { isArchived: true, archivedAt: new Date() },
  });
  const archiveProject = db.project.update({
    where: { id: projectId },
    data: { isArchived: true, archivedAt: new Date() },
  });
  await db.$transaction([archiveInvoices, archiveProject]);
  return null;
};
