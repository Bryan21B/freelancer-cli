import "dotenv/config";

import { clients } from "./schema/clients";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: process.env.DB_FILE_NAME!,
});

type Client = typeof clients.$inferInsert;

const insertClient = async (client: Client) => {
  return db.insert(clients).values(client);
};

const newClient: Client = {
  firstName: "Bryan",
  lastName: "Blanchot",
  companyName: "Bryan Blanchot",
  email: "bryan.blanchot@gmail.com",
};

await insertClient(newClient);
