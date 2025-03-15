import {
  FormattedClient,
  formatClientObject,
  formatClientTable,
} from "../utils/formatters.js";
import {
  archiveClientById,
  getAllClients,
  getClientById,
  unarchiveClientById,
  updateClientById,
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
      console.log(formatClientTable(client));
    });

  clientCommand
    .command("archive")
    .description("Archive a client by its id")
    .argument("<id>", "ID of the client to archive")
    .action(async (rawId: string) => {
      const client = await archiveClientById(toInt(rawId));
      console.log(chalk.green(`${client.companyName} is archived`));
    });

  clientCommand
    .command("update")
    // TODO Add validation
    .description("Update a client by its id")
    .argument("<id>", "ID of the client to update")
    .option("--address <addressStreet>", "address of the client")
    .option("--zip <addressZip>", "zip of the client")
    .option("--city <addressCity>", "zip of the client")
    .option("--email <email>", "client's email")
    .option("--company <company>", "client's company")
    .option("--phone <phone>", "client's phone number")
    .option("--first-name <firstName>", "client's first name")
    .option("--last-name <lastName>", "client's last name")
    .action(async (rawId: string, options) => {
      console.log(JSON.stringify(options));
      const client = await updateClientById(toInt(rawId), options);
      console.log(
        chalk.green(`${client.companyName} updated with the details below\n`)
      );

      console.log(formatClientTable(client));
    });

  clientCommand
    .command("unarchive")
    .description("Unarchive a client by its ID")
    .argument("<id>", "ID of the client to unarchive")
    .action(async (rawId: string) => {
      const client = await unarchiveClientById(toInt(rawId));
      console.log(chalk.green(`${client.companyName} is unarchived`));
      console.log(formatClientTable(client));
    });

  return clientCommand;
}
