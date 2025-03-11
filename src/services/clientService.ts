import { Client, NewClient, newClientSchema } from "../types/models";

import { Prisma } from "@prisma/client";
import db from "../../prisma/index";
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

// export const archiveClientById = async (clientId: Client["id"]) => {
//   try {
//     const archivedClient = await db.client.update({
//       where: { id: clientId },
//       data: { isArchived: true, archivedAt: new Date() },
//     });
//   } catch (error) {}
// };
