import { Command } from "commander";
import { config } from "../utils/cli-config.js";

export const initCommand = new Command()
  .command("init")
  .description("Set up the initial parameters")
  .action(() => {
    config.clear();
    config.set({
      firstName: "Bryan",
      lastName: "Blanchot",
      email: "bryan.blanchot@gmail.com",
      address: {
        street: "142 rue du faubourg saint denis",
        city: "Paris",
        zipCode: "75010",
        country: "France",
      },
    });
    console.log("You're all set");
  });
