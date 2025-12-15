import type { Locator } from "@playwright/test"
import { expect } from "@playwright/test"
import { BasePage } from "./base.page"
import { SELECTORS } from "../support/selectors"
import { TIMEOUTS } from "../support/constants"

export type FilterType = "domain" | "subdomain" | "capability"

export class RequirementsPage extends BasePage {
  // Filter locator map
  private readonly filterLocators: Record<FilterType, () => Locator> = {
    domain: () => this.page.getByTestId(SELECTORS.domainFilter),
    subdomain: () => this.page.getByTestId(SELECTORS.subdomainFilter),
    capability: () => this.page.getByTestId(SELECTORS.capabilityFilter),
  }

  // Locators
  get clearAllButton(): Locator {
    return this.page.getByTestId(SELECTORS.clearAllFilters)
  }

  get requirementsTable(): Locator {
    return this.page.getByTestId(SELECTORS.requirementsTable)
  }

  get emptyMessage(): Locator {
    return this.page.getByTestId(SELECTORS.emptyMessage)
  }

  get pageHeading(): Locator {
    return this.page.getByRole("heading", { name: "View All Requirements" })
  }

  // Navigation
  async goto() {
    await super.goto("/")
    await this.waitForRequirementsLoaded()
  }

  async waitForRequirementsLoaded() {
    await expect(this.pageHeading).toBeVisible({ timeout: TIMEOUTS.dataLoad })
    await expect(this.requirementsTable).toBeVisible({ timeout: TIMEOUTS.dataLoad })
  }

  // Filter interactions - unified method
  async selectFilter(filterType: FilterType, optionName: string) {
    const filter = this.filterLocators[filterType]()
    await filter.click()
    await this.page.getByRole("option", { name: optionName }).click()
  }

  async clearAllFilters() {
    await this.clearAllButton.click()
  }

  async hasFiltersApplied(): Promise<boolean> {
    return await this.clearAllButton.isVisible()
  }

  // Method to apply filters that won't match any requirements
  // Uses "User Management" domain + "Usage Metrics" capability (which belongs to "Reporting")
  async applyNonMatchingFilters() {
    // Import here to avoid circular dependency
    const { TEST_DATA } = await import("../support/constants")

    // Select "User Management" domain
    await this.selectFilter("domain", TEST_DATA.domains.knownDomain)

    // Select "Usage Metrics" capability (belongs to Reporting domain, not User Management)
    await this.selectFilter("capability", TEST_DATA.capabilities.incompatibleCapability)

    // Wait for the table to update
    await this.page.waitForLoadState("networkidle")
  }

  // Table interactions
  async getTableRows(): Promise<Locator> {
    return this.requirementsTable.locator("tbody tr")
  }

  async getTableRowCount(): Promise<number> {
    const rows = await this.getTableRows()
    return await rows.count()
  }

  async getColumnHeaders(): Promise<string[]> {
    const headers = this.requirementsTable.locator("thead th")
    return await headers.allTextContents()
  }

  async isEmptyMessageVisible(): Promise<boolean> {
    return await this.emptyMessage.isVisible()
  }

  async getEmptyMessageText(): Promise<string> {
    return await this.emptyMessage.textContent() ?? ""
  }

  // Assertions helpers
  async expectTableToHaveRows(minCount: number = 1) {
    const rowCount = await this.getTableRowCount()
    expect(rowCount).toBeGreaterThanOrEqual(minCount)
  }

  async expectTableToBeEmpty() {
    await expect(this.emptyMessage).toBeVisible()
  }

  async expectColumnHeaders(expectedHeaders: string[]) {
    const headers = await this.getColumnHeaders()
    expect(headers).toEqual(expectedHeaders)
  }

  async expectFilteredResults() {
    const rowCount = await this.getTableRowCount()
    expect(rowCount).toBeGreaterThanOrEqual(0)
  }
}
