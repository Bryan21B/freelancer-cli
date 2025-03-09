import Conf from "conf";

const schema = {
  firstName: {
    type: "string",
    description: "User's first name",
  },
  lastName: {
    type: "string",
    description: "User's last name",
  },
  email: {
    type: "string",
    format: "email",
    description: "User's email address",
  },
  address: {
    type: "object",
    required: ["street", "city", "zipCode", "country"],
    properties: {
      street: {
        type: "string",
        description: "Street address including house/building number",
      },
      city: {
        type: "string",
        description: "City name",
      },

      zipCode: {
        type: "string",
        description: "Postal or ZIP code",
      },
      country: {
        type: "string",
        description: "Country name",
        default: "France",
      },
    },
  },
  averageDailyRate: {
    type: "number",
    minimum: 0,
    description: "User's average daily rate in currency units",
    default: 0,
  },
};

export const config = new Conf({ projectName: "freelancer-cli", schema });
