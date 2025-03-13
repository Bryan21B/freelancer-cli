import {
  archiveInvoiceById,
  createInvoice,
  getAllInvoices,
  getClientInvoices,
  getInvoiceById,
  getInvoiceByNumber,
  getProjectInvoices,
  updateInvoiceStatusById,
} from "../../src/services/invoiceService";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createClientWithInvoicesAndProjects,
  createInvoices,
  setupTestDb,
} from "../helpers/testUtils";

import { createInvoiceData } from "../helpers";
import { db } from "../../prisma";
import { invoiceStatusSchema } from "../../src/types/models";
import { z } from "zod";

vi.mock("@prisma/client");

describe("Invoice Service", () => {
  beforeEach(async () => {
    setupTestDb();
    await createClientWithInvoicesAndProjects();
  });

  describe("createInvoice", () => {
    it("should create a new invoice and return it", async () => {
      const newInvoice = createInvoiceData({
        clientId: 1,
        projectId: 1,
        invoiceNumber: 1,
        totalCost: 1000,
        dueDate: new Date(),
        status: "DRAFT",
      });

      const invoice = await createInvoice(newInvoice);
      expect(invoice).toMatchObject({
        ...newInvoice,
        id: expect.any(Number),
        isArchived: false,
        archivedAt: null,
      });
    });

    it("should throw an error when required data is missing", async () => {
      const invalidInvoice = createInvoiceData();
      delete (invalidInvoice as { invoiceNumber?: number }).invoiceNumber;

      await expect(createInvoice(invalidInvoice)).rejects.toThrowError(
        "Invalid invoice data"
      );
    });

    it("should throw an error when invoice data is invalid", async () => {
      const invalidInvoice = createInvoiceData({
        clientId: 1,
        projectId: 1,
        invoiceNumber: -1, // Invalid negative number
        totalCost: -1000, // Invalid negative cost
        dueDate: new Date(),
        status: "INVALID_STATUS" as z.infer<typeof invoiceStatusSchema>, // Invalid status
      });

      await expect(createInvoice(invalidInvoice)).rejects.toThrowError(
        "Invalid invoice data"
      );
    });
  });

  describe("getInvoiceById", () => {
    let testInvoice: Awaited<ReturnType<typeof createInvoice>>;

    beforeEach(async () => {
      const newInvoice = createInvoiceData({
        clientId: 1,
        projectId: 1,
        invoiceNumber: 1,
        totalCost: 1000,
        dueDate: new Date(),
        status: "DRAFT",
      });
      testInvoice = await createInvoice(newInvoice);
    });

    it("should return the invoice when it exists and is not archived", async () => {
      const invoice = await getInvoiceById(testInvoice.id);
      expect(invoice).toMatchObject({
        id: testInvoice.id,
        invoiceNumber: 1,
        totalCost: 1000,
        status: "DRAFT",
        isArchived: false,
      });
    });

    it("should throw an error when invoice does not exist", async () => {
      await expect(getInvoiceById(999)).rejects.toThrow();
    });

    it("should throw an error when invoice is archived and includeArchived is false", async () => {
      await db.invoice.update({
        where: { id: testInvoice.id },
        data: { isArchived: true, archivedAt: new Date() },
      });
      await expect(getInvoiceById(testInvoice.id)).rejects.toThrow();
    });

    it("should return archived invoice when includeArchived is true", async () => {
      await db.invoice.update({
        where: { id: testInvoice.id },
        data: { isArchived: true, archivedAt: new Date() },
      });
      const invoice = await getInvoiceById(testInvoice.id, true);
      expect(invoice).toMatchObject({
        id: testInvoice.id,
        invoiceNumber: 1,
        totalCost: 1000,
        status: "DRAFT",
        isArchived: true,
      });
    });
  });

  describe("getInvoiceByNumber", () => {
    let testInvoice: Awaited<ReturnType<typeof createInvoice>>;

    beforeEach(async () => {
      const newInvoice = createInvoiceData({
        clientId: 1,
        projectId: 1,
        invoiceNumber: 1,
        totalCost: 1000,
        dueDate: new Date(),
        status: "DRAFT",
      });
      testInvoice = await createInvoice(newInvoice);
    });

    it("should return the invoice when it exists and is not archived", async () => {
      const invoice = await getInvoiceByNumber(testInvoice.invoiceNumber);
      expect(invoice).toMatchObject({
        id: testInvoice.id,
        invoiceNumber: 1,
        totalCost: 1000,
        status: "DRAFT",
        isArchived: false,
      });
    });

    it("should throw an error when invoice does not exist", async () => {
      await expect(getInvoiceByNumber(999)).rejects.toThrow();
    });

    it("should throw an error when invoice is archived and includeArchived is false", async () => {
      await db.invoice.update({
        where: { id: testInvoice.id },
        data: { isArchived: true, archivedAt: new Date() },
      });
      await expect(
        getInvoiceByNumber(testInvoice.invoiceNumber)
      ).rejects.toThrow();
    });

    it("should return archived invoice when includeArchived is true", async () => {
      await db.invoice.update({
        where: { id: testInvoice.id },
        data: { isArchived: true, archivedAt: new Date() },
      });
      const invoice = await getInvoiceByNumber(testInvoice.invoiceNumber, true);
      expect(invoice).toMatchObject({
        id: testInvoice.id,
        invoiceNumber: 1,
        totalCost: 1000,
        status: "DRAFT",
        isArchived: true,
      });
    });
  });

  describe("getClientInvoices", () => {
    beforeEach(async () => {
      await createInvoices();
    });

    it("should return all non-archived invoices for a client", async () => {
      const invoices = await getClientInvoices(1);
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => !invoice.isArchived)).toBe(true);
      expect(invoices.every((invoice) => invoice.clientId === 1)).toBe(true);
    });

    it("should throw an error when client does not exist", async () => {
      await expect(getClientInvoices(999)).rejects.toThrow("No invoices found");
    });

    it("should throw an error when no invoices exist for client", async () => {
      await db.invoice.deleteMany();
      await expect(getClientInvoices(1)).rejects.toThrow("No invoices found");
    });

    it("should return archived invoices when includeArchived is true", async () => {
      await db.invoice.updateMany({
        where: { clientId: 1 },
        data: { isArchived: true, archivedAt: new Date() },
      });
      const invoices = await getClientInvoices(1, true);
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => invoice.isArchived)).toBe(true);
      expect(invoices.every((invoice) => invoice.clientId === 1)).toBe(true);
    });
  });

  describe("getProjectInvoices", () => {
    beforeEach(async () => {
      await createInvoices();
    });

    it("should return all non-archived invoices for a project", async () => {
      const invoices = await getProjectInvoices(1);
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => !invoice.isArchived)).toBe(true);
      expect(invoices.every((invoice) => invoice.projectId === 1)).toBe(true);
    });

    it("should throw an error when project does not exist", async () => {
      await expect(getProjectInvoices(999)).rejects.toThrow(
        "No invoices found"
      );
    });

    it("should throw an error when no invoices exist for project", async () => {
      await db.invoice.deleteMany();
      await expect(getProjectInvoices(1)).rejects.toThrow("No invoices found");
    });

    it("should return archived invoices when includeArchived is true", async () => {
      await db.invoice.updateMany({
        where: { projectId: 1 },
        data: { isArchived: true, archivedAt: new Date() },
      });
      const invoices = await getProjectInvoices(1, true);
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => invoice.isArchived)).toBe(true);
      expect(invoices.every((invoice) => invoice.projectId === 1)).toBe(true);
    });
  });

  describe("getAllInvoices", () => {
    beforeEach(async () => {
      await createInvoices();
    });

    it("should return all non-archived invoices by default", async () => {
      const invoices = await getAllInvoices();
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => !invoice.isArchived)).toBe(true);
    });

    it("should throw an error when no non-archived invoices exist", async () => {
      await db.invoice.updateMany({
        data: { isArchived: true, archivedAt: new Date() },
      });
      await expect(getAllInvoices()).rejects.toThrow("No invoices found");
    });

    it("should return all invoices including archived ones when includeArchived is true", async () => {
      await db.invoice.updateMany({
        data: { isArchived: true, archivedAt: new Date() },
      });
      const invoices = await getAllInvoices(true);
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => invoice.isArchived)).toBe(true);
    });

    it("should filter invoices by status", async () => {
      const invoices = await getAllInvoices(false, "DRAFT");
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => invoice.status === "DRAFT")).toBe(
        true
      );
    });

    it("should combine status and archive filters", async () => {
      await db.invoice.updateMany({
        where: { status: "DRAFT" },
        data: { isArchived: true, archivedAt: new Date() },
      });
      const invoices = await getAllInvoices(true, "DRAFT");
      expect(invoices).toBeInstanceOf(Array);
      expect(invoices.length).toBeGreaterThan(0);
      expect(invoices.every((invoice) => invoice.status === "DRAFT")).toBe(
        true
      );
      expect(invoices.every((invoice) => invoice.isArchived)).toBe(true);
    });
  });

  describe("archiveInvoiceById", () => {
    let testInvoice: Awaited<ReturnType<typeof createInvoice>>;

    beforeEach(async () => {
      const newInvoice = createInvoiceData({
        clientId: 1,
        projectId: 1,
        invoiceNumber: 1,
        totalCost: 1000,
        dueDate: new Date(),
        status: "DRAFT",
      });
      testInvoice = await createInvoice(newInvoice);
    });

    it("should mark the invoice as archived", async () => {
      const archivedInvoice = await archiveInvoiceById(testInvoice.id);
      expect(archivedInvoice.isArchived).toBe(true);
      expect(archivedInvoice.archivedAt).toBeInstanceOf(Date);
    });

    it("should throw an error when invoice does not exist", async () => {
      await expect(archiveInvoiceById(999)).rejects.toThrow();
    });
  });

  describe("updateInvoiceStatusById", () => {
    let testInvoice: Awaited<ReturnType<typeof createInvoice>>;

    beforeEach(async () => {
      const newInvoice = createInvoiceData({
        clientId: 1,
        projectId: 1,
        invoiceNumber: 1,
        totalCost: 1000,
        dueDate: new Date(),
        status: "DRAFT",
      });
      testInvoice = await createInvoice(newInvoice);
    });

    it("should update the invoice status", async () => {
      const updatedInvoice = await updateInvoiceStatusById(
        testInvoice.id,
        "PAID"
      );
      expect(updatedInvoice.status).toBe("PAID");
    });

    it("should throw an error when invoice does not exist", async () => {
      await expect(updateInvoiceStatusById(999, "PAID")).rejects.toThrow();
    });
  });
});
