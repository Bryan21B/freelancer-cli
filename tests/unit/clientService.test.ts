import {
  archiveClientById,
  createClient,
  getAllClients,
  getClientById,
  unarchiveClientById,
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

    beforeEach(async () => {
      const newClient = createClientData({
        firstName: "Test",
        lastName: "Client",
        email: "test@example.com",
      });
      testClient = await db.client.create({ data: newClient });
    });

    it("should return the client when it exists and is not archived", async () => {
      const client = await getClientById(testClient.id);
      expect(client).toBeTypeOf("object");
      expect(client).toMatchObject({
        id: testClient.id,
        firstName: "Test",
        lastName: "Client",
        email: "test@example.com",
        isArchived: false,
      });
    });

    it("should throw an error when client does not exist", async () => {
      await expect(getClientById(999)).rejects.toThrow();
    });

    it("should throw an error when client is archived and includeArchived is false", async () => {
      await db.client.update({
        where: { id: testClient.id },
        data: { isArchived: true, archivedAt: new Date() },
      });
      await expect(getClientById(testClient.id)).rejects.toThrow();
    });

    it("should return archived client when includeArchived is true", async () => {
      await db.client.update({
        where: { id: testClient.id },
        data: { isArchived: true, archivedAt: new Date() },
      });
      const client = await getClientById(testClient.id, true);
      expect(client).toBeTypeOf("object");
      expect(client).toMatchObject({
        id: testClient.id,
        firstName: "Test",
        lastName: "Client",
        email: "test@example.com",
        isArchived: true,
      });
    });
  });

  describe("getAllClients", () => {
    beforeEach(async () => {
      // Create test clients
      const client1 = createClientData({ firstName: "First" });
      const client2 = createClientData({ firstName: "Second" });
      const client3 = createClientData({ firstName: "Third" });

      await Promise.all([
        db.client.create({ data: client1 }),
        db.client.create({ data: client2 }),
        db.client.create({ data: client3 }),
      ]);
    });

    it("should return all non-archived clients by default", async () => {
      const clients = await getAllClients();

      expect(clients).toBeInstanceOf(Array);
      expect(clients.length).toBe(3);
      expect(clients.every((client) => !client.isArchived)).toBe(true);
    });

    it("should throw an error when no non-archived clients exist", async () => {
      await db.client.updateMany({
        data: { isArchived: true, archivedAt: new Date() },
      });
      await expect(getAllClients()).rejects.toThrow("No clients found");
    });
  });

  describe("updateClientById", async () => {
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

  describe("unarchiveClientById", () => {
    beforeEach(async () => {
      await createClientWithInvoicesAndProjects();
      await db.client.update({
        where: { id: 1 },
        data: { isArchived: true, archivedAt: new Date() },
      });
    });

    it("should mark the client as unarchived", async () => {
      const client = await unarchiveClientById(1);
      expect(client.isArchived).toBe(false);
      expect(client.archivedAt).toBeNull();
    });

    it("should throw when the client is not found", async () => {
      await expect(unarchiveClientById(23)).rejects.toThrow();
    });

    it("should not modify the client's projects", async () => {
      await unarchiveClientById(1);
      const projects = await db.project.findMany({ where: { clientId: 1 } });
      projects.forEach((project) => expect(project.isArchived).toBe(false));
      projects.forEach((project) => expect(project.archivedAt).toBeNull());
    });

    it("should not modify the client's invoices", async () => {
      await unarchiveClientById(1);
      const invoices = await db.invoice.findMany({ where: { clientId: 1 } });
      invoices.forEach((invoice) => expect(invoice.isArchived).toBe(false));
      invoices.forEach((invoice) => expect(invoice.archivedAt).toBeNull());
    });
  });
});
