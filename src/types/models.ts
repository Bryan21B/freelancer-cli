// Base type for common fields
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
  isArchived: boolean;
}

// Client types
export interface Client extends BaseEntity {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  addressCity?: string | null;
  addressZip?: string | null;
  addressStreet?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  invoices?: Invoice[];
  projects?: Project[];
}

export type NewClient = Omit<
  Client,
  "id" | "createdAt" | "updatedAt" | "invoices" | "projects"
>;

// Define the enum
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  VALIDATED = "VALIDATED",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

// Invoice types
export interface Invoice extends BaseEntity {
  invoiceNumber: number;
  totalCost: number;
  dueDate: Date;
  status: InvoiceStatus;
  validatedAt?: Date | null;
  clientId: number;
  projectId: number;
  client?: Client;
  project?: Project;
}

export type NewInvoice = Omit<
  Invoice,
  "id" | "createdAt" | "updatedAt" | "client" | "project"
>;

// Project types
export interface Project extends BaseEntity {
  name: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  clientId: number;
  client?: Client;
  invoices?: Invoice[];
}

export type NewProject = Omit<
  Project,
  "id" | "createdAt" | "updatedAt" | "client" | "invoices"
>;
