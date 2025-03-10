import { ExecaError, execa } from "execa";
import { beforeEach, describe, expect, it } from "vitest";

import { config } from "../../../src/utils/cli-config";

const CLI_PATH = "src/index.ts";

describe("the init command", () => {
  beforeEach(() => {
    // Clear the config before each test
    config.clear();
  });

  it("should inform the user that the config is setup", async () => {
    const { stdout } = await execa("tsx", [CLI_PATH, "init"], {
      shell: true,
    });

    // Verify the command output
    expect(stdout).toContain("You're all set");
  });

  it("should handle errors gracefully", async () => {
    try {
      await execa("tsx", [CLI_PATH, "init", "--invalid-flag"], {
        shell: true,
      });
      throw new Error("Should have failed with invalid flag");
    } catch (error) {
      const execaError = error as ExecaError;
      expect(execaError.stderr).toContain("error:");
    }
  });
});
