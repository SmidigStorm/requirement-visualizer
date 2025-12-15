import { createBdd } from "playwright-bdd"
import { test, expect } from "../fixtures/test"

const { Then } = createBdd(test)

Then("I should see all requirements in a table", async ({ requirementsPage }) => {
  await requirementsPage.expectTableToHaveRows(1)
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

Then("I should see only requirements belonging to that domain", async ({ requirementsPage }) => {
  await requirementsPage.expectFilteredResults()
})

Then("I should see only requirements belonging to that subdomain", async ({ requirementsPage }) => {
  await requirementsPage.expectFilteredResults()
})

Then("I should see only requirements belonging to that capability", async ({ requirementsPage }) => {
  await requirementsPage.expectFilteredResults()
})

Then("I should see only requirements matching both filters", async ({ requirementsPage }) => {
  await requirementsPage.expectFilteredResults()
})

Then("I should see all requirements", async ({ requirementsPage }) => {
  await requirementsPage.expectTableToHaveRows(1)
})

Then("I should see a message {string}", async ({ requirementsPage }, message: string) => {
  const emptyText = await requirementsPage.getEmptyMessageText()
  expect(emptyText).toContain(message)
})
