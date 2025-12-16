import { AirtableClient } from "./infrastructure/airtable-client"
import { TestDataRepository } from "./repositories/test-data-repository"
import type { TestDataIds } from "./types/test-data.types"

async function globalTeardown() {
  console.log("\n[Global Teardown] Cleaning up test data...")

  const client = new AirtableClient()
  const repository = new TestDataRepository(client)

  // Get stored IDs from setup
  const idsJson = process.env.TEST_DATA_IDS
  if (idsJson) {
    const ids: TestDataIds = JSON.parse(idsJson)
    await repository.deleteAll(ids)
    console.log("[Global Teardown] Test data cleaned up successfully")
  } else {
    // Fallback: cleanup all TEST- prefixed data
    console.log("[Global Teardown] No stored IDs, cleaning up by prefix...")
    await repository.cleanupStaleTestData()
    console.log("[Global Teardown] Stale test data cleaned up")
  }
}

export default globalTeardown
