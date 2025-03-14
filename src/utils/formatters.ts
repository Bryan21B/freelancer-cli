import { Client } from "../types/models.js";
import chalk from "chalk";
import { formatDistanceToNow } from "date-fns";

type UpdatedClient = {
  Name: string;
  Company: string;
  Address: string;
  Phone: string;
  Created: string;
  Archived?: string;
  Id?: number;
};

/**
 * Formats a Client object into a display-friendly format
 * @param {Client} client - The client object to format
 * @param {boolean} includeArchiveInfo - Whether to include archive status in output
 * @param {boolean} includeId - Whether to include client ID in output
 * @returns {UpdatedClient} Formatted client object with selected fields
 */
export const formatClientObject = (
  client: Client,
  includeArchiveInfo: boolean = false,
  includeId: boolean = true
) => {
  const updatedClient: UpdatedClient = {
    // Conditionally spread the Id field only if id param is true
    ...(includeId && { Id: client.id }),
    Name: `${client.firstName} ${client.lastName}`,
    Company: client.companyName,
    Address: `${client.addressStreet || ""}, ${client.addressZip || ""} ${
      client.addressCity || ""
    }`,
    Phone: `${client.phoneCountryCode || ""} ${client.phoneNumber || ""}`,
    Created: formatDistanceToNow(client.createdAt, { addSuffix: true }),
    // Conditionally spread the Archived field only if archiveInfo param is true
    ...(includeArchiveInfo && {
      Archived: client.isArchived ? chalk.yellow("yes") : "no",
    }),
  };

  return updatedClient;
};
