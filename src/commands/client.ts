import { FormattedClient, formatClientObject } from "../utils/formatters.js";
import {
  archiveClientById,
  getAllClients,
  getClientById,
} from "../services/clientService.js";

import { Client } from "../types/models.js";
import { Command } from "commander";
import Table from "easy-table";
import chalk from "chalk";
import { toInt } from "radash";

export function createClientCommand(): Command {
  const clientCommand = new Command("client").description("Manage clients");

  clientCommand
    .command("list")
    .description("List all clients in a table format")
    .action(async () => {
      const t = new Table();
      const clients: FormattedClient[] = (await getAllClients()).map(
        (client) => ({
          ...formatClientObject(client),
        })
      );
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
    .description("View a client by its id")
    .argument("<id>", "ID of the client to view")
    .action(async (rawId: string) => {
      const client: Client = await getClientById(toInt(rawId));
      const formattedClient: FormattedClient = formatClientObject(client);
      const t = new Table();
      Object.entries(formattedClient).forEach(([key, value]) => {
        t.cell(chalk.blue(key), value);
      });
      t.newRow();
      console.log(t.printTransposed());
    });

  clientCommand
    .command("archive")
    .description("Archive a client by its id")
    .argument("<id>", "ID of the client to archive")
    .action(async (rawId: string) => {
      const client = await archiveClientById(toInt(rawId));
      console.log(chalk.green(`${client.companyName} is archived`));
    });

  return clientCommand;
}
