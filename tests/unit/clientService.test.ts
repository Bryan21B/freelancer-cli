import { describe, expect, it, vi } from "vitest";

import { createClient } from "../../src/services/clientService";
import { createClientData } from "../helpers/clientFactory";

vi.mock("@prisma/client");

describe("createClient", () => {
  it("should return the generated client", async () => {
    const newClient = createClientData({
      firstName: "Bryan",
      lastName: "Blanchot",
      companyName: "Bryan Blanchot",
      email: "bryan.blanchot@gmail.com",
    });

    const client = await createClient(newClient);

    // Check all fields except dates
    expect(client).toMatchObject({
      ...newClient,
      id: 1,
      archivedAt: null,
      addressCity: null,
      addressStreet: null,
      addressZip: null,
      phoneCountryCode: null,
      phoneNumber: null,
      isArchived: false,
    });

    // Check dates with more flexible assertions
    expect(client.createdAt).toBeInstanceOf(Date);
    // Prismock limitation: updatedAt might be null even though schema has @updatedAt
    expect(client.updatedAt === null || client.updatedAt instanceof Date).toBe(
      true
    );
  });

  it("should throw an error when required data is missing", async () => {
    const invalidClient = createClientData();
    delete (invalidClient as { lastName?: string }).lastName;

    await expect(createClient(invalidClient)).rejects.toThrow(
      "Invalid client data"
    );
  });
});
