import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    globals: true,
    environment: "node",
  },
});
