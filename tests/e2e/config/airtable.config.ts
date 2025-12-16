import * as dotenv from "dotenv"
import * as path from "path"

// Load .env file from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

export const AIRTABLE_CONFIG = {
  apiToken: process.env.VITE_AIRTABLE_API_TOKEN,
  baseId: process.env.VITE_AIRTABLE_BASE_ID,
  baseUrl: `https://api.airtable.com/v0/${process.env.VITE_AIRTABLE_BASE_ID}`,
} as const

if (!AIRTABLE_CONFIG.apiToken || !AIRTABLE_CONFIG.baseId) {
  throw new Error(
    "Missing Airtable configuration. Ensure VITE_AIRTABLE_API_TOKEN and VITE_AIRTABLE_BASE_ID are set in .env"
  )
}

export const TEST_PREFIX = "TEST-"

export const TABLE_NAMES = {
  domain: "Domain",
  subdomain: "Subdomain",
  capability: "Capability",
  requirement: "Requirement",
} as const
