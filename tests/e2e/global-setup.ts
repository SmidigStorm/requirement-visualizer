import { AirtableClient } from "./infrastructure/airtable-client"
import { TestDataRepository } from "./repositories/test-data-repository"
import { TestDataBuilder } from "./builders/test-data-builder"
import { createRequirementsViewerTestData } from "./data/requirements-viewer.data"

async function globalSetup() {
  console.log("\n[Global Setup] Setting up test data...")

  const client = new AirtableClient()
  const repository = new TestDataRepository(client)

  // 1. Cleanup stale test data from previous runs
  await repository.cleanupStaleTestData()

  // 2. Create fresh test data
  const builder = new TestDataBuilder(repository)
  const testData = await createRequirementsViewerTestData(builder)

  console.log("[Global Setup] Test data created successfully")
  console.log(`  - Domain: ${testData.domain.name}`)
  console.log(`  - Subdomain: ${testData.subdomain.name}`)
  console.log(`  - Capability: ${testData.capability.name}`)
  console.log(`  - Requirements: ${testData.requirements.length}`)

  // Store IDs for teardown
  process.env.TEST_DATA_IDS = JSON.stringify(testData.ids)
}

export default globalSetup
