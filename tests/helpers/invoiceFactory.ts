import { NewInvoice } from "../../src/types/models";

interface InvoiceFactoryOptions extends Partial<NewInvoice> {
  clientId?: number;
  projectId?: number;
}

export const createInvoiceData = (
  options: InvoiceFactoryOptions = {}
): NewInvoice => {
  return {
    invoiceNumber: Math.floor(Math.random() * 10000),
    totalCost: 1000,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "DRAFT",
    validatedAt: null,
    clientId: options.clientId ?? 1,
    projectId: options.projectId ?? 1,
    isArchived: false,
    ...options,
  };
};
