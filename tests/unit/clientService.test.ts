import {
  archiveClientById,
  createClient,
  getAllClients,
  getClientById,
  updateClientById,
} from "../../src/services/clientService";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createClientWithInvoicesAndProjects,
  setupTestDb,
} from "../helpers/testUtils";

import { createClientData } from "../helpers";
import { db } from "../../prisma";

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
      // Type assertion to allow property deletion, then remove lastName to create invalid data
      delete (invalidClient as { lastName?: string }).lastName;

      await expect(createClient(invalidClient)).rejects.toThrowError(
        "Invalid client data"
      );
    });
  });

  describe("getClientById", () => {
    let testClient: Awaited<ReturnType<typeof createClient>>;

    beforeAll(async () => {
      const newClient = createClientData();
      testClient = await db.client.create({ data: newClient });
      const newClient2 = createClientData();
      await db.client.create({ data: newClient2 });
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
        db.client.create({ data: newClient1 }),
        db.client.create({ data: newClient2 }),
        db.client.create({ data: newClient3 }),
      ]);
    });

    it("should return all clients", async () => {
      const clients = await getAllClients();
      expect(clients).toHaveLength(3);
      expect(clients).toEqual(expect.arrayContaining(testClients));
    });

    it("should throw when there are no clients", async () => {
      setupTestDb(); // Clear the DB
      await expect(getAllClients()).rejects.toThrow();
    });
  });

  describe("updateClient", async () => {
    let testClient: Awaited<ReturnType<typeof createClient>>;

    beforeAll(async () => {
      const newClient = createClientData();
      testClient = await db.client.create({ data: newClient });
    });

    it("should return a client with updated details", async () => {
      const updatedClient = {
        firstName: "Jack",
        lastName: "Lang",
        addressCity: "Dijon",
      };
      const dbUpdatedClient = await updateClientById(
        testClient.id,
        updatedClient
      );

      expect(dbUpdatedClient).toMatchObject({
        ...testClient,
        firstName: "Jack",
        lastName: "Lang",
        id: 1,
        archivedAt: null,
        addressCity: "Dijon",
        addressStreet: null,
        addressZip: null,
        phoneCountryCode: null,
        phoneNumber: null,
        isArchived: false,
      });
    });

    it("should throw if a client cannot be found", async () => {
      const updatedClient = {
        firstName: "Jack",
        lastName: "Lang",
        addressCity: "Dijon",
      };

      await expect(updateClientById(999, updatedClient)).rejects.toThrow();
    });
  });

  describe("archiveClientsById", async () => {
    let testData: Awaited<
      ReturnType<typeof createClientWithInvoicesAndProjects>
    >;
    let archivedClient: Awaited<ReturnType<typeof archiveClientById>>;

    beforeEach(async () => {
      testData = await createClientWithInvoicesAndProjects();
      archivedClient = await archiveClientById(testData.client.id);
    });

    it("should mark the client as archived", () => {
      expect(archivedClient.isArchived).toBe(true);
    });

    it("should mark the client's project as archived", async () => {
      const project = await db.project.findFirst({
        where: { clientId: testData.client.id },
      });
      expect(project).toBeDefined();
      expect(project?.isArchived).toBe(true);
      expect(project?.archivedAt).toBeInstanceOf(Date);
    });

    it("should mark the client's invoices as archived", async () => {
      const invoices = await db.invoice.findMany({
        where: { clientId: testData.client.id },
      });
      expect(invoices).toHaveLength(3); // Verify we have all invoices
      expect(invoices?.every((invoice) => invoice.isArchived)).toBe(true);
      expect(
        invoices?.every((invoice) => invoice.archivedAt instanceof Date)
      ).toBe(true);
    });

    it("should archive the client even when there is no invoice", async () => {
      await db.invoice.deleteMany({ where: { clientId: testData.client.id } });
      await db.client.update({
        where: { id: testData.client.id },
        data: { isArchived: false, archivedAt: null },
      });
      const archivedClient = await archiveClientById(testData.client.id);
      const projects = await db.project.findMany({
        where: { clientId: testData.client.id },
      });
      expect(archivedClient.isArchived).toBe(true);
      expect(archivedClient.archivedAt).toBeInstanceOf(Date);
      expect(projects.every((project) => project.isArchived)).toBe(true);
    });

    it("should throw when there is no client", async () => {
      await expect(archiveClientById(999)).rejects.toThrow();
    });
  });
});
