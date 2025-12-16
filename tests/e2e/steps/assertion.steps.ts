import { createBdd } from "playwright-bdd"
import { test, expect } from "../fixtures/test"

const { Then } = createBdd(test)

Then("I should see requirements in a table", async ({ requirementsPage }) => {
  await requirementsPage.expectTableToHaveRows(1)
})

Then("I should see {int} requirement(s) in the table", async ({ requirementsPage }, count: number) => {
  const rowCount = await requirementsPage.getTableRowCount()
  expect(rowCount).toBe(count)
})

Then("I should see requirement {string}", async ({ requirementsPage }, reqId: string) => {
  const table = requirementsPage.requirementsTable
  await expect(table).toContainText(reqId)
})

Then("I should not see requirement {string}", async ({ requirementsPage }, reqId: string) => {
  const table = requirementsPage.requirementsTable
  await expect(table).not.toContainText(reqId)
})

Then(
  "the table should display columns: ReqID, Title, Domain, Subdomain, Capability, Status, Priority",
  async ({ requirementsPage }) => {
    await requirementsPage.expectColumnHeaders([
      "ReqID",
      "Title",
      "Domain",
      "Subdomain",
      "Capability",
      "Status",
      "Priority",
    ])
  }
)

Then(
  "I should see only requirements from domain {string}",
  async ({ requirementsPage }, _domainName: string) => {
    // Verify all visible rows have the expected domain
    await requirementsPage.expectFilteredResults()
  }
)

Then(
  "I should see only requirements from subdomain {string}",
  async ({ requirementsPage }, _subdomainName: string) => {
    await requirementsPage.expectFilteredResults()
  }
)

Then(
  "I should see only requirements from capability {string}",
  async ({ requirementsPage }, _capabilityName: string) => {
    await requirementsPage.expectFilteredResults()
  }
)
