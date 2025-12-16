import { RequirementsPage } from "../pages/requirements.page"
import { CompletenessPage } from "../pages/completeness.page"
import { test as testDataTest, REQUIREMENTS_VIEWER_TEST_DATA } from "./test-data.fixture"

type Fixtures = {
  requirementsPage: RequirementsPage
  completenessPage: CompletenessPage
}

export const test = testDataTest.extend<Fixtures>({
  requirementsPage: async ({ page }, use) => {
    const requirementsPage = new RequirementsPage(page)
    await use(requirementsPage)
  },
  completenessPage: async ({ page }, use) => {
    const completenessPage = new CompletenessPage(page)
    await use(completenessPage)
  },
})

export { expect } from "@playwright/test"
export { REQUIREMENTS_VIEWER_TEST_DATA }
