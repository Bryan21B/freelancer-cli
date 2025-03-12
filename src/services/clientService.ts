import { Client, NewClient, newClientSchema } from "../types/models";

import { Prisma } from "@prisma/client";
import { db } from "../../prisma/index";
import { isEmpty } from "lodash";
import { z } from "zod";

/**
 * Creates a new client in the database
 * @param {NewClient} client - The client data to create
 * @returns {Promise<Client>} The created client
 * @throws {Error} If client data is invalid or a client with same email exists
 */
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

/**
 * Retrieves a client by their ID
 * @param {Client["id"]} clientId - The ID of the client to retrieve
 * @returns {Promise<Client>} The found client
 * @throws {Error} If no client is found with the given ID
 */
export const getClientById = async (
  clientId: Client["id"]
): Promise<Client> => {
  return await db.client.findUniqueOrThrow({ where: { id: clientId } });
};

/**
 * Retrieves all clients from the database
 * @returns {Promise<Client[]>} Array of all clients
 * @throws {Error} If no clients exist in the database
 */
export const getAllClients = async (): Promise<Client[]> => {
  const clients = await db.client.findMany();
  if (isEmpty(clients)) {
    throw new Error("No clients found");
  }
  return clients;
};

/**
 * Updates a client's information by their ID
 * @param {Client["id"]} clientId - The ID of the client to update
 * @param {Partial<NewClient>} client - The new client data
 * @returns {Promise<Client>} The updated client
 * @throws {Error} If no client is found with the given ID
 */
export const updateClientById = async (
  clientId: Client["id"],
  client: Partial<NewClient>
): Promise<Client> => {
  return await db.client.update({ where: { id: clientId }, data: client });
};

/**
 * Archives a client and all their associated projects and invoices
 * @param {Client} client - The client to archive
 * @returns {Promise<Client>} The archived client
 */
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

/**
 * Archives a client and all their associated projects and invoices by ID
 * @param {Client["id"]} clientId - The ID of the client to archive
 * @returns {Promise<Client>} The archived client
 * @throws {Error} If no client is found with the given ID
 */
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
