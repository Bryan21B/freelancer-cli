import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { baseFields } from "./base";
import { invoices } from "./invoices";
import { projects } from "./projects";
import { relations } from "drizzle-orm";

export const clients = sqliteTable("clients_table", {
  ...baseFields,
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  companyName: text("company_name").notNull(),
  email: text("email").unique(),
  addressStreet: text("address_street"),
  addressCity: text("address_city"),
  addressZip: text("address_zip"),
  phoneCountryCode: text("phone_country_code"),
  phoneNumber: text("phone_number"),
});

export const clientRelations = relations(clients, ({ many }) => ({
  projects: many(projects, {
    fields: [clients.id],
    references: [projects.clientId],
    relationName: "client_projects",
  }),
  invoices: many(invoices, {
    fields: [clients.id],
    references: [invoices.clientId],
    relationName: "client_invoices",
  }),
}));
