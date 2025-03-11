import { Client, NewClient, newClientSchema } from "../types/models";

import { Prisma } from "@prisma/client";
import { db } from "../../prisma/index";
import { z } from "zod";

export const createClient = async (client: NewClient): Promise<Client> => {
  try {
    const validatedClient = newClientSchema.parse(client);
    return await db.client.create({
      data: validatedClient,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid client data: ${error.message}`);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A client with this email already exists");
      }
    }
    throw error;
  }
};

export const getClientById = async (
  clientId: Client["id"]
): Promise<Client> => {
  return await db.client.findUniqueOrThrow({ where: { id: clientId } });
};

export const getAllClients = async (): Promise<Client[]> => {
  return await db.client.findMany();
};

export const updateClient = async (
  clientId: Client["id"],
  client: NewClient
): Promise<Client> => {
  return await db.client.update({ where: { id: clientId }, data: client });
};

export const archiveClient = async (client: Client): Promise<Client> => {
  const archiveInvoices = db.invoice.updateMany({
    where: { clientId: client.id },
    data: { isArchived: true, archivedAt: new Date() },
  });

  const archiveProjects = db.project.updateMany({
    where: { clientId: client.id },
    data: {
      isArchived: true,
      archivedAt: new Date(),
    },
  });

  const archiveClient = db.client.update({
    where: { id: client.id },
    data: { isArchived: true, archivedAt: new Date() },
  });

  await db.$transaction([archiveInvoices, archiveProjects, archiveClient]);
  return archiveClient;
};

export const archiveClientById = async (
  clientId: Client["id"]
): Promise<Client> => {
  const archiveInvoices = db.invoice.updateMany({
    where: { clientId: clientId },
    data: { isArchived: true, archivedAt: new Date() },
  });

  const archiveProjects = db.project.updateMany({
    where: { clientId: clientId },
    data: {
      isArchived: true,
      archivedAt: new Date(),
    },
  });

  const archiveClient = db.client.update({
    where: { id: clientId },
    data: { isArchived: true, archivedAt: new Date() },
  });

  await db.$transaction([archiveInvoices, archiveProjects, archiveClient]);
  return archiveClient;
};
