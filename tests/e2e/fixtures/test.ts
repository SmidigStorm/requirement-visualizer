import { test as base } from "playwright-bdd"
import { RequirementsPage } from "../pages/requirements.page"

type Fixtures = {
  requirementsPage: RequirementsPage
}

export const test = base.extend<Fixtures>({
  requirementsPage: async ({ page }, use) => {
    const requirementsPage = new RequirementsPage(page)
    await use(requirementsPage)
  },
})

export { expect } from "@playwright/test"
