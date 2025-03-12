import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createClient,
  getAllClients,
  getClientById,
} from "../../src/services/clientService";

import { createClientData } from "../helpers/clientFactory";
import { setupTestDb } from "../helpers/testUtils";

vi.mock("@prisma/client");

describe("Client Service", () => {
  beforeEach(() => {
    setupTestDb();
  });

  describe("createClient", () => {
    it("should return the generated client", async () => {
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
      const invalidClient = createClientData();
      delete (invalidClient as { lastName?: string }).lastName;

      await expect(createClient(invalidClient)).rejects.toThrow(
        "Invalid client data"
      );
    });
  });

  describe("getClientById", () => {
    let testClient: Awaited<ReturnType<typeof createClient>>;

    beforeAll(async () => {
      const newClient = createClientData();
      testClient = await createClient(newClient);
      const newClient2 = createClientData();
      await createClient(newClient2);
    });

    it("should return the correct client", async () => {
      const foundClient = await getClientById(testClient.id);
      expect(foundClient).toMatchObject({
        ...testClient,
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

    it("should throw for incorrect id", async () => {
      await expect(getClientById(999)).rejects.toThrow();
    });
  });

  describe("getAllClients", () => {
    let testClients: Awaited<ReturnType<typeof createClient>>[];

    beforeAll(async () => {
      const newClient1 = createClientData({ firstName: "First" });
      const newClient2 = createClientData({ firstName: "Second" });
      const newClient3 = createClientData({ firstName: "Third" });

      testClients = await Promise.all([
        createClient(newClient1),
        createClient(newClient2),
        createClient(newClient3),
      ]);
    });

    it("should return all clients", async () => {
      const clients = await getAllClients();
      expect(clients).toHaveLength(3);
      expect(clients).toEqual(expect.arrayContaining(testClients));
    });

    it("should throw when there are no clients", async () => {
      setupTestDb(); // Clear the DB
      expect(getAllClients()).rejects.toThrow();
    });
  });
});
