import { Command } from "commander";
import chalk from "chalk";
import { config } from "../utils/cli-config.js";

export function createClientCommand(): Command {
  const clientCommand = new Command("client").description("Manage clients");

  return clientCommand;
}
