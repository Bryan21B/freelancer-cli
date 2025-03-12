import {
  archiveProjectById,
  createProject,
  endProject,
  getAllProjects,
  getProjectById,
  getProjectByInvoiceID,
  getProjectsByClientId,
  updateProject,
} from "../../src/services/projectService";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createClientWithInvoicesAndProjects,
  createProjects,
  setupTestDb,
} from "../helpers/testUtils";

import { before } from "lodash";
import { createClientData } from "../helpers";
import { db } from "../../prisma";

vi.mock("@prisma/client");

describe("Project Service", () => {
  beforeEach(async () => {
    setupTestDb();
    await createClientWithInvoicesAndProjects();
  });

  describe("getAllProjects", () => {
    it("should return all projects when projects exist", async () => {
      // First project is created by createClientWithInvoicesAndProjects
      // Create additional projects (3 more)
      await createProjects();

      const allProjects = await getAllProjects();
      // Should have 4 projects total (1 from setup + 3 new ones)
      expect(allProjects).toHaveLength(4);
      expect(allProjects).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Test Project 1",
          }),
        ])
      );
    });

    it("should throw an error when no projects exist", async () => {
      await createProjects();
      await db.project.deleteMany();
      await expect(getAllProjects()).rejects.toThrow();
    });
  });

  describe("getProjectById", () => {
    it("should return the project when it exists", async () => {
      const project = await getProjectById(1);

      expect(project).toBeTypeOf("object");
      expect(project).toMatchObject({
        id: 1,
        name: expect.any(String),
        clientId: 1,
        isArchived: false,
      });
    });

    it("should throw an error when project does not exist", async () => {
      await expect(getProjectById(999)).rejects.toThrow();
    });
  });

  describe("getProjectsByClientId", () => {
    it("should return the projects when they exist", async () => {
      //TODO Check what happens when client doesn't exist
      await createProjects();
      const projects = await getProjectsByClientId(1);
      expect(projects).toBeInstanceOf(Array);
      expect(projects).toHaveLength(4); // One project from createClientWithInvoicesAndProjects and three from createProjects
      expect(projects[0]).toMatchObject({
        id: 1,
        name: expect.any(String),
        clientId: 1,
        isArchived: false,
      });
    });

    it("should throw an error when projects do not exist for that client", async () => {
      await db.project.deleteMany();
      await expect(getProjectsByClientId(999)).rejects.toThrow();
    });
  });

  describe("getProjectByInvoiceId", () => {
    it("should return the project when it exists", async () => {
      const project = await getProjectByInvoiceID(1);
      expect(project).toBeTypeOf("object");
      expect(project).toMatchObject({
        id: 1,
        name: expect.any(String),
        clientId: 1,
        isArchived: false,
      });
    });

    it("should throw an error when project does not exist", async () => {
      //TODO: Actually we need to check both cases when invoice doesn't exist and when project doesn't exist
      await db.project.deleteMany();
      await expect(getProjectByInvoiceID(1)).rejects.toThrowError(
        "No project found for that invoice"
      );
    });

    it("should throw an error when invoice does not exist", async () => {
      await expect(getProjectByInvoiceID(43)).rejects.toThrowError(
        "Invoice not found"
      );
    });
  });
});
