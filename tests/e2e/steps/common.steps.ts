import { createBdd } from "playwright-bdd"
import { test } from "../fixtures/test"
import { TEST_DATA } from "../support/constants"

const { Given } = createBdd(test)

Given("the requirements data is loaded from Airtable", async ({ requirementsPage }) => {
  await requirementsPage.goto()
})

Given("I am viewing all requirements", async ({ requirementsPage }) => {
  await requirementsPage.goto()
})

Given("I have filters applied", async ({ requirementsPage }) => {
  await requirementsPage.goto()
  await requirementsPage.selectFilter("domain", TEST_DATA.domains.knownDomain)
})
