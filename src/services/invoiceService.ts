import {
  Client,
  Invoice,
  NewInvoice,
  Project,
  invoiceStatusSchema,
  newInvoiceSchema,
} from "../types/models";

import { Prisma } from "@prisma/client";
import { db } from "../../prisma/index";
import { isEmpty } from "lodash";
import { z } from "zod";

type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

/**
 * Creates a new invoice in the database
 * @param {NewInvoice} invoice - The invoice data to create
 * @returns {Promise<Invoice>} The created invoice
 * @throws {Error} If invoice data is invalid or an invoice with same number exists
 */
export const createInvoice = async (invoice: NewInvoice): Promise<Invoice> => {
  try {
    const validatedInvoice = newInvoiceSchema.parse(invoice);
    return await db.invoice.create({
      data: validatedInvoice,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid invoice data: ${error.message}`);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("An invoice with this number already exists");
      }
    }
    throw error;
  }
};

/**
 * Retrieves an invoice by its ID
 * @param {Invoice["id"]} invoiceId - The ID of the invoice to retrieve
 * @param {boolean} includeArchived - Whether to include archived invoices
 * @returns {Promise<Invoice>} The invoice object
 * @throws {Error} If the invoice does not exist
 */
export const getInvoiceById = async (
  invoiceId: Invoice["id"],
  includeArchived = false
): Promise<Invoice> => {
  return await db.invoice.findUniqueOrThrow({
    where: {
      id: invoiceId,
      ...(includeArchived ? {} : { isArchived: false }),
    },
  });
};

/**
 * Retrieves an invoice by its number
 * @param {Invoice["invoiceNumber"]} invoiceNumber - The invoice number to retrieve
 * @param {boolean} includeArchived - Whether to include archived invoices
 * @returns {Promise<Invoice>} The invoice object
 * @throws {Error} If the invoice does not exist
 */
export const getInvoiceByNumber = async (
  invoiceNumber: Invoice["invoiceNumber"],
  includeArchived = false
): Promise<Invoice> => {
  return await db.invoice.findUniqueOrThrow({
    where: {
      invoiceNumber,
      ...(includeArchived ? {} : { isArchived: false }),
    },
  });
};

/**
 * Retrieves all invoices for a client
 * @param {Client["id"]} clientId - The ID of the client
 * @param {boolean} includeArchived - Whether to include archived invoices
 * @returns {Promise<Invoice[]>} Array of matching invoices
 * @throws {Error} If no matching invoices are found
 */
export const getClientInvoices = async (
  clientId: Client["id"],
  includeArchived = false
): Promise<Invoice[]> => {
  const invoices = await db.invoice.findMany({
    where: {
      clientId,
      ...(includeArchived ? {} : { isArchived: false }),
    },
  });

  if (isEmpty(invoices)) {
    throw new Error("No invoices found");
  }

  return invoices;
};

/**
 * Retrieves all invoices for a project
 * @param {Project["id"]} projectId - The ID of the project
 * @param {boolean} includeArchived - Whether to include archived invoices
 * @returns {Promise<Invoice[]>} Array of matching invoices
 * @throws {Error} If no matching invoices are found
 */
export const getProjectInvoices = async (
  projectId: Project["id"],
  includeArchived = false
): Promise<Invoice[]> => {
  const invoices = await db.invoice.findMany({
    where: {
      projectId,
      ...(includeArchived ? {} : { isArchived: false }),
    },
  });

  if (isEmpty(invoices)) {
    throw new Error("No invoices found");
  }

  return invoices;
};

/**
 * Archives an invoice by its ID
 * @param {Invoice["id"]} invoiceId - The ID of the invoice to archive
 * @returns {Promise<Invoice>} The archived invoice
 * @throws {Error} If the invoice does not exist
 */
export const archiveInvoiceById = async (
  invoiceId: Invoice["id"]
): Promise<Invoice> => {
  return await db.invoice.update({
    where: { id: invoiceId },
    data: { isArchived: true, archivedAt: new Date() },
  });
};

/**
 * Updates an invoice's status by its ID
 * @param {Invoice["id"]} invoiceId - The ID of the invoice to update
 * @param {InvoiceStatus} status - The new status for the invoice
 * @returns {Promise<Invoice>} The updated invoice
 * @throws {Error} If the invoice does not exist
 */
export const updateInvoiceStatusById = async (
  invoiceId: Invoice["id"],
  status: InvoiceStatus
): Promise<Invoice> => {
  return await db.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });
};

/**
 * Retrieves all invoices from the database with optional filtering
 * @param {boolean} includeArchived - Whether to include archived invoices
 * @param {InvoiceStatus} status - Filter by invoice status
 * @returns {Promise<Invoice[]>} Array of matching invoices
 * @throws {Error} If no invoices are found
 */
export const getAllInvoices = async (
  includeArchived = false,
  status?: InvoiceStatus
): Promise<Invoice[]> => {
  const invoices = await db.invoice.findMany({
    where: {
      ...(includeArchived ? {} : { isArchived: false }),
      ...(status ? { status } : {}),
    },
  });
  if (isEmpty(invoices)) {
    throw new Error("No invoices found");
  }

  return invoices;
};
