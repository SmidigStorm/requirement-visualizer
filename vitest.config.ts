import path from "path"
import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    test: {
      include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
      environment: "node",
      env: {
        VITE_AIRTABLE_API_TOKEN: env.VITE_AIRTABLE_API_TOKEN,
        VITE_AIRTABLE_BASE_ID: env.VITE_AIRTABLE_BASE_ID,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
