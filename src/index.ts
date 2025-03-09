#!/usr/bin/env node

import { ErrorLevel, handleError } from "./utils/error-handler.js";

import { Command } from "commander";

const program = new Command();
const version: string = "0.0.2";

program
  .name("freelancer-cli")
  .version(version)
  .description(
    "CLI for freelancers to manage the admin side of their business."
  );

program.exitOverride((err) => {
  if (err.code === "commander.missingArgument") {
    handleError(
      new Error(`Missing required argument: ${err.message}`),
      ErrorLevel.ERROR
    );
  } else if (err.code === "commander.unknownOption") {
    handleError(new Error(`Unknown option: ${err.message}`), ErrorLevel.ERROR);
  } else {
    handleError(err, ErrorLevel.FATAL);
  }
});

try {
  program.parse(process.argv);
} catch (error) {
  handleError(error as Error, ErrorLevel.FATAL);
}
