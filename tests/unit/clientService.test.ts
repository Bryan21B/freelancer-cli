import { describe, expect, it, vi } from "vitest";

import { NewClient } from "../../src/types/models";
import { createClient } from "../../src/services/clientService";

vi.mock("@prisma/client");

describe("createClient", () => {
  it("should return the generated client", async () => {
    const newClient = {
      firstName: "Bryan",
      lastName: "Blanchot",
      companyName: "Bryan Blanchot",
      email: "bryan.blanchot@gmail.com",
    };

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
    const invalidClient: Partial<NewClient> = {
      firstName: "Bryan",
      companyName: "Bryan Blanchot",
      email: "bryan.blanchot@gmail.com",
      // lastName is missing
    };

    await expect(createClient(invalidClient as NewClient)).rejects.toThrow(
      "Invalid client data"
    );
  });
});
