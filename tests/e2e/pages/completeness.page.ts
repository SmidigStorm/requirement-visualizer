import type { Locator } from "@playwright/test"
import { expect } from "@playwright/test"
import { BasePage } from "./base.page"
import { SELECTORS } from "../support/selectors"
import { TIMEOUTS } from "../support/constants"

export class CompletenessPage extends BasePage {
  get treemapContainer(): Locator {
    return this.page.getByTestId(SELECTORS.treemapContainer)
  }

  get treemapSvg(): Locator {
    return this.page.getByTestId(SELECTORS.treemapSvg)
  }

  get pageHeading(): Locator {
    return this.page.getByRole("heading", { name: "Requirements Completeness" })
  }

  get domainFilter(): Locator {
    return this.page.getByTestId(SELECTORS.domainFilter)
  }

  get subdomainFilter(): Locator {
    return this.page.getByTestId(SELECTORS.subdomainFilter)
  }

  get capabilityFilter(): Locator {
    return this.page.getByTestId(SELECTORS.capabilityFilter)
  }

  get clearAllButton(): Locator {
    return this.page.getByTestId(SELECTORS.clearAllFilters)
  }

  async goto() {
    await super.goto("/completeness")
    await this.waitForTreemapLoaded()
  }

  async waitForTreemapLoaded() {
    await expect(this.pageHeading).toBeVisible({ timeout: TIMEOUTS.dataLoad })
    await expect(this.treemapContainer).toBeVisible({ timeout: TIMEOUTS.dataLoad })
  }

  async getTreemapRectangles(): Promise<Locator> {
    return this.treemapSvg.locator("rect")
  }

  async getTreemapRectangleCount(): Promise<number> {
    const rects = await this.getTreemapRectangles()
    return await rects.count()
  }

  async getTreemapTexts(): Promise<string[]> {
    const texts = this.treemapSvg.locator("text")
    return await texts.allTextContents()
  }

  async selectFilter(filterType: "domain" | "subdomain" | "capability", optionName: string) {
    const filterMap = {
      domain: this.domainFilter,
      subdomain: this.subdomainFilter,
      capability: this.capabilityFilter,
    }
    const filter = filterMap[filterType]
    await filter.click()
    await this.page.getByRole("option", { name: optionName }).click()
  }

  async clearAllFilters() {
    await this.clearAllButton.click()
  }

  async hasFiltersApplied(): Promise<boolean> {
    return await this.clearAllButton.isVisible()
  }

  // Get all capability rectangles (leaf nodes with metrics text)
  async getCapabilityRectangles(): Promise<Locator> {
    // Capability rectangles are those with completion color (not the gray structural ones)
    return this.treemapSvg.locator("g").filter({ has: this.page.locator("text") })
  }

  async expectTreemapVisible() {
    await expect(this.treemapContainer).toBeVisible()
    await expect(this.treemapSvg).toBeVisible()
  }

  async expectTreemapHasRectangles(minCount: number = 1) {
    const count = await this.getTreemapRectangleCount()
    expect(count).toBeGreaterThanOrEqual(minCount)
  }
}
