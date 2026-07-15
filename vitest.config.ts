import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["packages/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["packages/research/{extraction,processing}/**/*.ts"],
      exclude: [
        "packages/research/{extraction,processing}/index.ts",
        "packages/research/{extraction,processing}/types.ts",
        "packages/research/{extraction,processing}/**/*.d.ts",
        "packages/research/{extraction,processing}/**/*.test.ts",
        "packages/research/processing/processor.ts",
      ],
      thresholds: {
        branches: 95,
        functions: 95,
        lines: 95,
        statements: 95,
      },
    },
  },
})
