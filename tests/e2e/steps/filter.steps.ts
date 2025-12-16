import { createBdd } from "playwright-bdd"
import { test } from "../fixtures/test"

const { When } = createBdd(test)

When("I open the requirements viewer", async ({ requirementsPage }) => {
  await requirementsPage.goto()
})

When("I select domain {string}", async ({ requirementsPage }, domainName: string) => {
  await requirementsPage.selectFilter("domain", domainName)
})

When("I select subdomain {string}", async ({ requirementsPage }, subdomainName: string) => {
  await requirementsPage.selectFilter("subdomain", subdomainName)
})

When("I select capability {string}", async ({ requirementsPage }, capabilityName: string) => {
  await requirementsPage.selectFilter("capability", capabilityName)
})

When("I clear all filters", async ({ requirementsPage }) => {
  await requirementsPage.clearAllFilters()
})
