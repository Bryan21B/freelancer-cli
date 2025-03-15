import { Client } from "../types/models.js";
import Table from "easy-table";
import chalk from "chalk";
import { formatDistanceToNow } from "date-fns";

export type FormattedClient = {
  Name: string;
  Company: string;
  Address: string;
  Phone: string;
  Created: string;
  Updated: string;
  Archived?: string;
  Id?: number;
};

/**
 * Formats a Client object into a display-friendly format
 * @param {Client} client - The client object to format
 * @param {boolean} includeArchiveInfo - Whether to include archive status in output
 * @param {boolean} includeId - Whether to include client ID in output
 * @returns {FormattedClient} Formatted client object with selected fields
 */
export const formatClientObject = (
  client: Client,
  includeArchiveInfo: boolean = false,
  includeId: boolean = true
) => {
  const updatedClient: FormattedClient = {
    // Conditionally spread the Id field only if id param is true
    ...(includeId && { Id: client.id }),
    Name: `${client.firstName} ${client.lastName}`,
    Company: client.companyName,
    Address: `${client.addressStreet || ""}, ${client.addressZip || ""} ${
      client.addressCity || ""
    }`,
    Phone: `${client.phoneCountryCode || ""} ${client.phoneNumber || ""}`,
    Created: formatDistanceToNow(client.createdAt, { addSuffix: true }),
    Updated: formatDistanceToNow(client.updatedAt, { addSuffix: true }),
    // Conditionally spread the Archived field only if archiveInfo param is true
    ...(includeArchiveInfo && {
      Archived: client.isArchived ? chalk.yellow("Yes") : "No",
    }),
  };

  return updatedClient;
};

export const formatClientTable = (
  client: Client,
  includeArchiveInfo: boolean = false,
  includeId: boolean = true
): string => {
  const formattedClient = formatClientObject(
    client,
    includeArchiveInfo,
    includeId
  );
  const t = new Table();

  Object.entries(formattedClient).forEach(([key, value]) => {
    t.cell(chalk.blue(key), value);
  });
  t.newRow();

  return t.printTransposed();
};
