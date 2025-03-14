import { Client } from "../types/models.js";
import { formatDistanceToNow } from "date-fns";

export const formatClientObject = (client: Client) => {
  const updatedClient = {
    Name: `${client.firstName} ${client.lastName}`,
    Company: client.companyName,
    Address: `${client.addressStreet}, ${client.addressZip} ${client.addressCity}`,
    Phone: `${client.phoneCountryCode} ${client.phoneNumber}`,
    Created: `${formatDistanceToNow(client.createdAt, { addSuffix: true })}`,
  };
  return updatedClient;
};
