import { Prisma } from "@prisma/client";
import { createPrismock } from "prismock";

const PrismockClient = createPrismock(Prisma);

export * from "@prisma/client";
export { PrismockClient as PrismaClient };
