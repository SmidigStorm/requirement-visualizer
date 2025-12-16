import { createBdd } from "playwright-bdd"
import { test, REQUIREMENTS_VIEWER_TEST_DATA } from "../fixtures/test"

const { Given } = createBdd(test)

Given("the test data is loaded", async () => {
  // Test data is created by global-setup.ts before all tests run
  // This step just acknowledges that we expect the data to exist
  console.log(`Test data available: ${REQUIREMENTS_VIEWER_TEST_DATA.domain}`)
})

Given("I am viewing all requirements", async ({ requirementsPage }) => {
  await requirementsPage.goto()
})
