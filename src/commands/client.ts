import { Client } from "../types/models.js";
import { Command } from "commander";
import Table from "easy-table";
import chalk from "chalk";
import { config } from "../utils/cli-config.js";
import { toInt } from "radash";

export function createClientCommand(): Command {
  const clientCommand = new Command("client").description("Manage clients");
  clientCommand
    .command("list")
    .description("List all clients")
    .action(async () => {
      try {
        const t = new Table();
        const clients: Client[] = (await getAllClients()).map((client) => ({
          ...client,
        }));
        clients.forEach(function (client) {
          t.cell("Id", client.id);
          t.cell("Name", client.firstName);
          t.cell("Company", client.companyName);
          t.cell("Email", client.email);
          t.newRow();
        });
        console.log(
          "Below are your clients, to view more info on a client run 'client view' followed by the id number. \n"
        );
        console.log(t.toString());
      } catch (error) {
        console.error(error);
        process.exit(0);
      }
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
