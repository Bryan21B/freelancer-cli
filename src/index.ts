#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();
const version: string = "0.0.1";

program
  .name("freelancer-cli")
  .version(version)
  .description(
    "CLI for freelancers to manage the admin side of their business."
  );

program.parse(process.argv);
