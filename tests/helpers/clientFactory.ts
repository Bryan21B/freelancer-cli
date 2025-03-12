import { NewClient } from "../../src/types/models";

interface ClientFactoryOptions extends Partial<NewClient> {
  firstName?: string;
  lastName?: string;
  email?: string;
}

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
