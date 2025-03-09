import chalk from "chalk";

export enum ErrorLevel {
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

export function handleError(
  error: Error,
  level: ErrorLevel = ErrorLevel.ERROR
): void {
  // Log detailed error info for debugging
  console.error(chalk.red(`[${level}] ${error.message}`));

  if (error.stack && level === ErrorLevel.FATAL) {
    console.error(chalk.gray(error.stack));
  }

  // Exit with non-zero code for FATAL errors
  if (level === ErrorLevel.FATAL) {
    process.exit(1);
  }
}
