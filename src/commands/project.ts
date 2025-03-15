import { Command } from "commander";
import chalk from "chalk";

export function createProjectCommand(): Command {
  const projectCommand = new Command("project").description(
    "Manage projects, not yet implemented"
  );

  projectCommand
    .command("list")
    .description("List all projects")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  projectCommand
    .command("update")
    .description("Update a projects")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  projectCommand
    .command("archive")
    .description("archive a projects")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  projectCommand
    .command("view")
    .description("view a project")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  return projectCommand;
}
