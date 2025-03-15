import { Command } from "commander";
import chalk from "chalk";

export function createinvoiceCommand(): Command {
  const invoiceCommand = new Command("invoice").description(
    "Manage invoices, not yet implemented"
  );

  invoiceCommand
    .command("list")
    .description("List all invoices")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  invoiceCommand
    .command("update")
    .description("Update an invoices")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  invoiceCommand
    .command("archive")
    .description("archive an invoices")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  invoiceCommand
    .command("view")
    .description("view an invoice")
    .action(() => console.log(chalk.yellow("Command not yet implemented")));

  return invoiceCommand;
}
