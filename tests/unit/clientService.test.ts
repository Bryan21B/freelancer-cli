import {
  createClient,
  getAllClients,
  getClientById,
} from "../../src/services/clientService";
import { describe, expect, it, vi } from "vitest";

import { createClientData } from "../helpers/clientFactory";
import { setupTestDb } from "../helpers/testUtils";

vi.mock("@prisma/client");

describe("Client Service", () => {
  describe("createClient", () => {
    it("should return the generated client", async () => {
      setupTestDb();
      const newClient = createClientData({
        firstName: "Bryan",
        lastName: "Lang",
        companyName: "Bryan Blanchot",
        email: "bryan.blanchot@gmail.com",
      });

      const client = await createClient(newClient);

      // Check all fields except dates
      expect(client).toMatchObject({
        ...newClient,
        id: 1,
        archivedAt: null,
        addressCity: null,
        addressStreet: null,
        addressZip: null,
        phoneCountryCode: null,
        phoneNumber: null,
        isArchived: false,
      });

      // Check dates with more flexible assertions
      expect(client.createdAt).toBeInstanceOf(Date);
      // Prismock limitation: updatedAt might be null even though schema has @updatedAt
      expect(
        client.updatedAt === null || client.updatedAt instanceof Date
      ).toBe(true);
    });

    it("should throw an error when required data is missing", async () => {
      setupTestDb();
      const invalidClient = createClientData();
      delete (invalidClient as { lastName?: string }).lastName;

      await expect(createClient(invalidClient)).rejects.toThrow(
        "Invalid client data"
      );
    });
  });

  describe("getClientById", () => {
    it("should return the correct client", async () => {
      setupTestDb();
      const newClient = createClientData();
      const clients = await getAllClients();

      console.debug(clients);

      const foundClient = await getClientById(1);
      expect(foundClient).toMatchObject({
        ...newClient,
        id: 1,
        archivedAt: null,
        addressCity: null,
        addressStreet: null,
        addressZip: null,
        phoneCountryCode: null,
        phoneNumber: null,
        isArchived: false,
      });
    });
  });
});
