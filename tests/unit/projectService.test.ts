import {
  archiveProjectById,
  createProject,
  endProjectById,
  getAllProjects,
  getProjectById,
  getProjectByInvoiceID,
  getProjectsByClientId,
  updateProjectById,
} from "../../src/services/projectService";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createClientWithInvoicesAndProjects,
  createProjects,
  setupTestDb,
} from "../helpers/testUtils";

import { NewProject } from "../../src/types/models";
import { createProjectData } from "../helpers";
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

    it("should throw an error when client does not exist", async () => {
      await expect(getProjectsByClientId(999)).rejects.toThrowError(
        "Client not found"
      );
    });

    it("should throw an error when project does not exist for client", async () => {
      await db.project.deleteMany();
      await expect(getProjectsByClientId(1)).rejects.toThrowError("No project");
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

  describe("createProject", () => {
    const newProject = createProjectData({
      clientId: 1,
      name: "Created Project",
    });

    it("should create a project and return it", async () => {
      const project = await createProject(newProject);
      expect(project).toMatchObject({
        ...newProject,
        archivedAt: null,
        isArchived: false,
      });
    });

    it("should throw an error when required data is missing", async () => {
      const invalidProject = createProjectData();
      delete (invalidProject as { name?: string }).name;
      await expect(createProject(invalidProject)).rejects.toThrowError(
        "Invalid project data"
      );
    });
  });

  describe("updateProjectById", () => {
    it("should return an updated project", async () => {
      const initialProject = await db.project.findFirstOrThrow({
        where: { id: 1 },
      });
      const updatedProject: Partial<NewProject> = {
        name: "Modified Project",
        description: "This project has been modified",
      };

      const dbUpdatedProject = await updateProjectById(1, updatedProject);
      expect(dbUpdatedProject).toMatchObject({
        ...initialProject,
        description: "This project has been modified",
        name: "Modified Project",
      });
      expect(dbUpdatedProject).not.toBe(initialProject);
    });

    it("should throw an error when the project is not found", async () => {
      const updatedProject: Partial<NewProject> = {
        name: "Modified Project",
        description: "This project has been modified",
      };

      await expect(updateProjectById(54, updatedProject)).rejects.toThrowError(
        "No Project found"
      );
    });
  });

  describe("endProjectById", () => {
    it("should set an end date that is later than the start date", async () => {
      // Create a fixed point in time to start from
      const startTime = new Date();
      // Mock the system time to ensure consistent test behavior
      vi.setSystemTime(startTime);

      // Create a new project which will use our mocked time as its start date
      const project = await createProject(createProjectData());

      // Move time forward by 1 second to simulate time passing
      // This ensures the end date will be later than the start date
      vi.setSystemTime(startTime.getTime() + 1000);

      // End the project, which should set its end date to our new mocked time
      const updatedProject = await endProjectById(project.id);

      // Verify the end date was set and is a valid Date object
      expect(updatedProject.endDate).toBeInstanceOf(Date);
      // Verify the end date is chronologically after the start date
      expect(updatedProject.endDate!.getTime()).toBeGreaterThan(
        project.startDate.getTime()
      );

      // Reset the mocked timers to prevent affecting other tests
      vi.useRealTimers();
    });
  });
});
