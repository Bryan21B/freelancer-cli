import type { Client, Invoice, Project } from "@prisma/client";

import { z } from "zod";

// Base schema for common fields
const baseEntitySchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().nullable(),
  isArchived: z.boolean(),
});

// Reuse Prisma's enum
export const invoiceStatusSchema = z.enum([
  "DRAFT",
  "VALIDATED",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);

// Validation schemas using Prisma types with relationships
export const clientSchema: z.ZodType<Client> = baseEntitySchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  companyName: z.string(),
  email: z.string().email(),
  addressCity: z.string().nullable(),
  addressZip: z.string().nullable(),
  addressStreet: z.string().nullable(),
  phoneCountryCode: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  // Define relationships
  invoices: z.array(z.lazy(() => invoiceSchema)).optional(),
  projects: z.array(z.lazy(() => projectSchema)).optional(),
});

export const invoiceSchema: z.ZodType<Invoice> = baseEntitySchema.extend({
  invoiceNumber: z.number(),
  totalCost: z.number(),
  dueDate: z.date(),
  status: invoiceStatusSchema,
  validatedAt: z.date().nullable(),
  clientId: z.number(),
  projectId: z.number(),
  // Define relationships
  client: z.lazy(() => clientSchema).optional(),
  project: z.lazy(() => projectSchema).optional(),
});

export const projectSchema = baseEntitySchema.extend({
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  clientId: z.number(),
  // Define relationships
  client: z.lazy(() => clientSchema).optional(),
  invoices: z.array(z.lazy(() => invoiceSchema)).optional(),
});

// Create schemas for new entities
export const newClientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  companyName: z.string(),
  email: z.string().email(),
  addressCity: z.string().nullable().optional().default(null),
  addressZip: z.string().nullable().optional().default(null),
  addressStreet: z.string().nullable().optional().default(null),
  phoneCountryCode: z.string().nullable().optional().default(null),
  phoneNumber: z.string().nullable().optional().default(null),
  isArchived: z.boolean().default(false),
});

export const newInvoiceSchema = z.object({
  invoiceNumber: z.number(),
  totalCost: z.number(),
  dueDate: z.date(),
  status: invoiceStatusSchema,
  validatedAt: z.date().nullable(),
  clientId: z.number(),
  projectId: z.number(),
  isArchived: z.boolean().default(false),
});

export const newProjectSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date().nullable(),
  clientId: z.number(),
  isArchived: z.boolean().default(false),
});

// Create types for new entities
export type NewClient = Partial<z.infer<typeof newClientSchema>> & {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
};

export type NewInvoice = z.infer<typeof newInvoiceSchema>;
export type NewProject = z.infer<typeof newProjectSchema>;

// Export Prisma types directly
export type { Client, Invoice, Project };
