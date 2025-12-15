import { createBdd } from "playwright-bdd"
import { test } from "../fixtures/test"
import { TEST_DATA } from "../support/constants"

const { When } = createBdd(test)

When("I open the requirements viewer", async ({ requirementsPage }) => {
  await requirementsPage.goto()
})

When("I select a domain filter", async ({ requirementsPage }) => {
  await requirementsPage.selectFilter("domain", TEST_DATA.domains.knownDomain)
})

When("I select a subdomain filter", async ({ requirementsPage }) => {
  await requirementsPage.selectFilter("subdomain", TEST_DATA.subdomains.knownSubdomain)
})

When("I select a capability filter", async ({ requirementsPage }) => {
  await requirementsPage.selectFilter("capability", TEST_DATA.capabilities.knownCapability)
})

When("I clear all filters", async ({ requirementsPage }) => {
  await requirementsPage.clearAllFilters()
})

When("I apply filters that match no requirements", async ({ requirementsPage }) => {
  await requirementsPage.applyNonMatchingFilters()
})
