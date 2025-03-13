import { NewClient } from "../../src/types/models";

interface ClientFactoryOptions extends Partial<NewClient> {
  firstName?: string;
  lastName?: string;
  email?: string;
}

/**
 * Creates test data for a new client with default values that can be overridden
 * @param {ClientFactoryOptions} options - Optional overrides for client properties
 * @returns {NewClient} A new client object with default and overridden values
 * @example
 * const testClient = createClientData({
 *   firstName: "Jane",
 *   email: "jane@example.com"
 * });
 */
export const createClientData = (
  options: ClientFactoryOptions = {}
): NewClient => {
  return {
    firstName: "John",
    lastName: "Doe",
    companyName: "Test Company",
    email: "john.doe@example.com",
    addressCity: null,
    addressZip: null,
    addressStreet: null,
    phoneCountryCode: null,
    phoneNumber: null,
    isArchived: false,
    ...options,
  };
};
