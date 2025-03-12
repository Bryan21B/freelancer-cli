import { db } from "../../prisma";
import { onTestFinished } from "vitest";

/**
 * Sets up automatic database cleanup after test completion.
 * This function should be called at the start of each test that modifies the database.
 */
export const setupTestDb = () => {
  onTestFinished(async () => {
    // Clean all tables in reverse order of dependencies
    await Promise.all([
      db.invoice.deleteMany(),
      db.project.deleteMany(),
      db.client.deleteMany(),
    ]);
  });
};
