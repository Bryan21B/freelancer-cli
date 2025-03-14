import { getAllClients, getClientById } from "../services/clientService.js";

import { Client } from "../types/models.js";
import { Command } from "commander";
import Table from "easy-table";
import chalk from "chalk";
import { config } from "../utils/cli-config.js";
import { formatClientObject } from "../utils/formatters.js";
import { toInt } from "radash";

export function createClientCommand(): Command {
  const clientCommand = new Command("client").description("Manage clients");
  clientCommand
    .command("list")
    .description("List all clients")
    .action(async () => {
      const t = new Table();
      const clients = (await getAllClients()).map((client) => ({
        ...formatClientObject(client),
      }));
      clients.forEach((client) => {
        Object.entries(client).forEach(([key, value]) => {
          t.cell(chalk.blue(key), value);
        });
        t.newRow();
      });
      console.log(
        "Below are your clients, to view more info on a client run 'client view' followed by the id number. \n"
      );
      console.log(t.toString());
    });

  clientCommand
    .command("view")
    .description("View a client")
    .argument("<id>", "ID of the client to view")
    .action(async (rawId: string) => {
      const client = await getClientById(toInt(rawId));
      const formattedClient = formatClientObject(client);
      const t = new Table();
      Object.entries(formattedClient).forEach(([key, value]) => {
        t.cell(chalk.blue(key), value);
      });
      t.newRow();
      console.log(t.printTransposed());
    });

  return clientCommand;
}
