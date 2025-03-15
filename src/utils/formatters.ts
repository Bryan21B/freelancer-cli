import { Client } from "../types/models.js";
import Table from "easy-table";
import chalk from "chalk";
import { formatDistanceToNow } from "date-fns";

export type FormattedClient = {
  Name?: string;
  Company?: string;
  Email?: string;
  Address?: string;
  Phone?: string;
  Created?: string;
  Updated?: string;
  Archived?: string;
  Id?: number;
};

export interface FormatClientOptions {
  includeArchiveInfo?: boolean;
  includeId?: boolean;
  includeTimestamps?: boolean;
  includeEmail?: boolean;
  includePhone?: boolean;
  includeBasicInfo?: boolean;
  includeAddress?: boolean;
}

/**
 * Formats a Client object into a display-friendly format
 * @param {Client} client - The client object to format
 * @param {FormatClientOptions} options - Formatting options
 * @returns {FormattedClient} Formatted client object with selected fields
 */
export const formatClientObject = (
  client: Client,
  {
    includeArchiveInfo = false,
    includeId = true,
    includeTimestamps = false,
    includeEmail = true,
    includePhone = false,
    includeBasicInfo = true,
    includeAddress = true,
  }: FormatClientOptions = {}
): FormattedClient => {
  const updatedClient: FormattedClient = {
    // Optional ID field
    ...(includeId && { Id: client.id }),

    // Basic info fields
    ...(includeBasicInfo && {
      Name: `${client.firstName} ${client.lastName}`,
      Company: client.companyName,
    }),

    // Email field
    ...(includeEmail && {
      Email: client.email,
    }),

    // Phone field
    ...(includePhone && {
      Phone: `${client.phoneCountryCode || ""} ${
        client.phoneNumber || ""
      }`.trim(),
    }),

    // Address fields
    ...(includeAddress && {
      Address: `${client.addressStreet ? client.addressStreet + ", " : ""}${
        client.addressZip || ""
      } ${client.addressCity || ""}`.trim(),
    }),

    // Timestamp fields
    ...(includeTimestamps && {
      Created: formatDistanceToNow(client.createdAt, { addSuffix: true }),
      Updated: formatDistanceToNow(client.updatedAt, { addSuffix: true }),
    }),

    // Archive status
    ...(includeArchiveInfo && {
      Archived: client.isArchived ? chalk.yellow("Yes") : "No",
    }),
  };

  // Filter out empty strings and undefined values
  return Object.fromEntries(
    Object.entries(updatedClient).filter(
      ([, value]) => value !== undefined && value !== ""
    )
  ) as FormattedClient;
};

export const formatClientTable = (
  client: Client,
  options: FormatClientOptions = {}
): string => {
  const formattedClient = formatClientObject(client, options);
  const t = new Table();

  Object.entries(formattedClient).forEach(([key, value]) => {
    t.cell(chalk.blue(key), value);
  });
  t.newRow();

  return t.printTransposed();
};
