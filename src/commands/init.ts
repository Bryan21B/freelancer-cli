import { Command } from "commander";
import chalk from "chalk";
import { config } from "../utils/cli-config.js";

export const initCommand = new Command()
  .command("init")
  .description("set up the initial config")
  .action(() => {
    config.clear();
    // Set config here
    console.log(chalk.green("You're all set!"));
  });
