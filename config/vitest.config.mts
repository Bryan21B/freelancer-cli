import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "tests/**/*.test.ts",
      "tests/**/*.spec.ts",
      "tests/unit/**/*.test.ts",
      "tests/integration/**/*.test.ts",
    ],
    exclude: ["**/node_modules/**", "**/dist/**"],
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    globals: true,
    environment: "node",
    watch: true,
  },
});
