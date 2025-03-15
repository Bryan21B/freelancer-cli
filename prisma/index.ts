import "dotenv/config";

import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

// const newClient: Client = {
//   firstName: "Bryan",
//   lastName: "Blanchot",
//   companyName: "Bryan Blanchot",
//   email: "bryan.blanchot@gmail.com",
// };

// const client = await insertClient(newClient);
// const [newClientData] = client;
// console.debug(client);

// const newProject: Project = {
//   name: "New Project",
//   clientId: newClientData.id,
//   startDate: new Date(),
// };

// const project = await insertProject(newProject);
// console.log(project);

// Delete in correct order (projects first, then clients)
// await db.delete(projects);
// await db.delete(clients);
