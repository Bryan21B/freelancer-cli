-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "addressCity" TEXT,
    "addressZip" TEXT,
    "addressStreet" TEXT,
    "phoneCountryCode" TEXT,
    "phoneNumber" TEXT,
    "archivedAt" DATETIME,
    "isArchived" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Client" ("addressCity", "addressStreet", "addressZip", "archivedAt", "companyName", "createdAt", "email", "firstName", "id", "isArchived", "lastName", "phoneCountryCode", "phoneNumber", "updatedAt") SELECT "addressCity", "addressStreet", "addressZip", "archivedAt", "companyName", "createdAt", "email", "firstName", "id", "isArchived", "lastName", "phoneCountryCode", "phoneNumber", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
