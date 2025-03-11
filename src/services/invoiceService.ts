import {
  Invoice,
  NewInvoice,
  invoiceStatusSchema,
  newInvoiceSchema,
} from "../types/models";

import { Prisma } from "@prisma/client";
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("An invoice with this number already exists");
      }
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
  const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return await db.invoice.update({
    where: { id: invoiceId },
    data: { isArchived: true, archivedAt: new Date() },
  });
};

export const updateInvoiceStatusById = async (
  invoiceId: Invoice["id"],
  status: InvoiceStatus
): Promise<Invoice> => {
  const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return await db.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });
};
