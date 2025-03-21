#!/usr/bin/env node

import { Command } from "commander";
import { createClientCommand } from "./commands/client.js";
import { createProjectCommand } from "./commands/project.js";
import { createinvoiceCommand } from "./commands/invoice.js";
import { initCommand } from "./commands/init.js";

const program = new Command();
const version: string = "0.0.4";

program
  .name("freelancer-cli")
  .version(version)
  .description(
    "CLI for freelancers to manage the admin side of their business."
  );

program.addCommand(initCommand);
program.addCommand(createClientCommand());
program.addCommand(createProjectCommand());
program.addCommand(createinvoiceCommand());

program.parse(process.argv);
