import { describe, expect, it } from "vitest";
import {
  formatClientObject,
  formatClientTable,
  type FormattedClient,
} from "../../src/utils/formatters.js";
import { type Client } from "../../src/types/models.js";
import chalk from "chalk";
import { formatDistanceToNow } from "date-fns";

describe("formatters", () => {
  const NOW = new Date();
  const TWO_DAYS_AGO = new Date(NOW.getTime() - 2 * 24 * 60 * 60 * 1000);
  const ONE_DAY_AGO = new Date(NOW.getTime() - 24 * 60 * 60 * 1000);

  const mockClient: Client = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    companyName: "ACME Inc",
    email: "john@acme.com",
    phoneCountryCode: "+1",
    phoneNumber: "555-0123",
    addressStreet: "123 Main St",
    addressZip: "12345",
    addressCity: "Springfield",
    createdAt: TWO_DAYS_AGO,
    updatedAt: ONE_DAY_AGO,
    archivedAt: null,
    isArchived: false,
  };

  describe("formatClientObject", () => {
    it("should format with default options", () => {
      const result = formatClientObject(mockClient);

      const expected: FormattedClient = {
        Id: 1,
        Name: "John Doe",
        Company: "ACME Inc",
        Email: "john@acme.com",
        Address: "123 Main St, 12345 Springfield",
      };

      expect(result).toEqual(expected);
    });

    it("should exclude ID when includeId is false", () => {
      const result = formatClientObject(mockClient, { includeId: false });
      expect(result.Id).toBeUndefined();
    });

    it("should include phone when includePhone is true", () => {
      const result = formatClientObject(mockClient, { includePhone: true });
      expect(result.Phone).toBe("+1 555-0123");
    });

    it("should exclude basic info when includeBasicInfo is false", () => {
      const result = formatClientObject(mockClient, {
        includeBasicInfo: false,
      });
      expect(result.Name).toBeUndefined();
      expect(result.Company).toBeUndefined();
    });

    it("should exclude email when includeEmail is false", () => {
      const result = formatClientObject(mockClient, { includeEmail: false });
      expect(result.Email).toBeUndefined();
    });

    it("should exclude address when includeAddress is false", () => {
      const result = formatClientObject(mockClient, { includeAddress: false });
      expect(result.Address).toBeUndefined();
    });

    it("should include timestamps when includeTimestamps is true", () => {
      const result = formatClientObject(mockClient, {
        includeTimestamps: true,
      });
      expect(result.Created).toBe(
        formatDistanceToNow(TWO_DAYS_AGO, { addSuffix: true })
      );
      expect(result.Updated).toBe(
        formatDistanceToNow(ONE_DAY_AGO, { addSuffix: true })
      );
    });

    it("should include archive status when includeArchiveInfo is true", () => {
      const result = formatClientObject(mockClient, {
        includeArchiveInfo: true,
      });
      expect(result.Archived).toBe("No");

      const archivedClient = { ...mockClient, isArchived: true };
      const archivedResult = formatClientObject(archivedClient, {
        includeArchiveInfo: true,
      });
      expect(archivedResult.Archived).toBe(chalk.yellow("Yes"));
    });

    it("should handle partial client data", () => {
      const partialClient: Client = {
        ...mockClient,
        phoneCountryCode: "",
        phoneNumber: "",
        addressStreet: "",
        addressZip: "",
        addressCity: "",
      };

      const result = formatClientObject(partialClient, {
        includePhone: true,
        includeAddress: true,
      });

      expect(result.Phone).toBeUndefined();
      expect(result.Address).toBeUndefined();
    });

    it("should include all fields when all options are true", () => {
      const result = formatClientObject(mockClient, {
        includeId: true,
        includeBasicInfo: true,
        includeEmail: true,
        includePhone: true,
        includeAddress: true,
        includeTimestamps: true,
        includeArchiveInfo: true,
      });

      expect(result).toEqual({
        Id: 1,
        Name: "John Doe",
        Company: "ACME Inc",
        Email: "john@acme.com",
        Phone: "+1 555-0123",
        Address: "123 Main St, 12345 Springfield",
        Created: formatDistanceToNow(TWO_DAYS_AGO, { addSuffix: true }),
        Updated: formatDistanceToNow(ONE_DAY_AGO, { addSuffix: true }),
        Archived: "No",
      });
    });
  });

  describe("formatClientTable", () => {
    it("should format client as a table string", () => {
      const result = formatClientTable(mockClient);

      // Verify table structure
      expect(result).toContain(chalk.blue("Id"));
      expect(result).toContain("1");
      expect(result).toContain(chalk.blue("Name"));
      expect(result).toContain("John Doe");
      expect(result).toContain(chalk.blue("Company"));
      expect(result).toContain("ACME Inc");
    });

    it("should respect formatting options", () => {
      const result = formatClientTable(mockClient, {
        includeId: false,
        includeEmail: false,
        includeAddress: false,
      });

      // Should not contain excluded fields
      expect(result).not.toContain(chalk.blue("Id"));
      expect(result).not.toContain(chalk.blue("Email"));
      expect(result).not.toContain(chalk.blue("Address"));

      // Should contain included fields
      expect(result).toContain(chalk.blue("Name"));
      expect(result).toContain(chalk.blue("Company"));
    });
  });
});
