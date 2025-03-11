import {
  Invoice,
  NewInvoice,
  invoiceSchema,
  invoiceStatusSchema,
  newInvoiceSchema,
} from "../types/models";

import { db } from "../prisma/index";
import { z } from "zod";

type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

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
    if (error.code === "P2002") {
      throw new Error("An invoice with this number already exists");
    }
    throw error;
  }
};

export const getInvoiceById = async (
  invoiceId: Invoice["id"]
): Promise<Invoice> => {
  const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return invoice;
};

export const getInvoiceByNumber = async (
  invoiceNumber: Invoice["invoiceNumber"]
): Promise<Invoice> => {
  const invoice = await db.invoice.findUnique({ where: { invoiceNumber } });
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return invoice;
};

export const archiveInvoiceById = async (
  invoiceId: Invoice["id"]
): Promise<Invoice> => {
  try {
    const archivedInvoice = await db.invoice.update({
      where: { id: invoiceId },
      data: { isArchived: true, archivedAt: new Date() },
    });
    return archivedInvoice;
  } catch (error) {
    if (error.code === "P2001") {
      throw new Error("The invoice could not be found");
    }
    throw error;
  }
};

export const updateInvoiceStatusById = async (
  invoiceId: Invoice["id"],
  status: InvoiceStatus
): Promise<Invoice> => {
  try {
    const updatedInvoice = await db.invoice.update({
      where: { id: invoiceId },
      data: { status: status },
    });
    return updatedInvoice;
  } catch (error) {
    if (error.code === "P2001") {
      throw new Error("The invoice could not be found");
    }
    throw error;
  }
};
