import { NewProject } from "../../src/types/models";

interface ProjectFactoryOptions extends Partial<NewProject> {
  clientId?: number;
}

export const createProjectData = (
  options: ProjectFactoryOptions = {}
): NewProject => {
  return {
    name: "Test Project",
    description: null,
    startDate: new Date(),
    endDate: null,
    clientId: options.clientId ?? 1,
    isArchived: false,
    ...options,
  };
};
