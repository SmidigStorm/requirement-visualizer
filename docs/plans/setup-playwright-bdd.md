# Setup Playwright-BDD for E2E Testing

## Summary
Implement Cucumber-style BDD testing with Playwright for end-to-end tests. This includes reorganizing the test folder structure, setting up playwright-bdd, creating page objects, implementing step definitions for the existing feature file, and adding a "Clear All" button to the filter UI.

## Requirements
- [x] E2E-001: Install playwright-bdd - Packages installed, Playwright browsers available
- [x] E2E-002: Configure playwright-bdd - Config files created, feature files discovered
- [x] E2E-003: Implement step definitions - All steps from `view-and-filter-requirements.feature` have matching step definitions
- [x] E2E-004: Tests run against local dev server - `npm run test:e2e` starts dev server and runs tests
- [x] E2E-005: Reorganize test folders - Create unit, integration, e2e folders
- [x] E2E-006: Add "Clear All" button - Button clears all filters when clicked

## Architecture Approach
**Clean Architecture with Page Object Model** was chosen for:
- Maintainability: UI changes only affect page objects, not step definitions
- Reusability: Page objects and fixtures can be shared across future feature files
- Reliability: data-testid attributes for stable selectors
- Readability: Step definitions stay in business language

### Layer Structure
```
Feature Files (Business Language)
  ↓
Step Definitions (Glue Code)
  ↓
Page Objects (UI Abstraction)
  ↓
Playwright API (Browser Control)
```

## Codebase Patterns
- Path alias: `@/*` → `./src/*` (tsconfig.json:9-10)
- Test naming: `*.unit.test.ts`, `*.integration.test.ts`
- Component props: Interfaces defined inline with components
- UI components: Radix UI with shadcn/ui patterns, use `data-slot` attributes

## Implementation Steps

### Step 1: Install Dependencies
**Implements**: E2E-001
**Files**:
- `package.json` - Add devDependencies

```bash
npm install -D @playwright/test playwright playwright-bdd @cucumber/cucumber
npx playwright install chromium
```

### Step 2: Reorganize Test Folder Structure
**Implements**: E2E-005
**Files**:
- `tests/unit/` - Create directory, move `hierarchy.unit.test.ts`
- `tests/integration/` - Create directory, move `airtable.integration.test.ts`
- `tests/e2e/` - Create directory structure

```
tests/
├── unit/
│   └── hierarchy.unit.test.ts      # Moved from tests/
├── integration/
│   └── airtable.integration.test.ts # Moved from tests/
└── e2e/
    ├── fixtures/
    │   └── test.ts
    ├── pages/
    │   ├── base.page.ts
    │   └── requirements.page.ts
    ├── steps/
    │   ├── common.steps.ts
    │   ├── filter.steps.ts
    │   └── assertion.steps.ts
    └── support/
        ├── constants.ts
        └── selectors.ts
```

### Step 3: Update Vitest Configuration
**Implements**: E2E-005
**Files**:
- `vitest.config.ts` - Update include pattern

```typescript
include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"]
```

### Step 4: Create Playwright Configuration
**Implements**: E2E-002
**Files**:
- `playwright.config.ts` - Create new file

```typescript
import { defineConfig, devices } from "@playwright/test"
import { defineBddConfig } from "playwright-bdd"

const testDir = defineBddConfig({
  features: "docs/requirements/**/*.feature",
  steps: "tests/e2e/steps/**/*.ts",
})

export default defineConfig({
  testDir,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
```

### Step 5: Create TypeScript Config for E2E
**Implements**: E2E-002
**Files**:
- `tsconfig.e2e.json` - Create new file
- `tsconfig.json` - Add reference

### Step 6: Update .gitignore
**Implements**: E2E-002
**Files**:
- `.gitignore` - Add E2E artifacts

```gitignore
# Playwright
.features-gen/
test-results/
playwright-report/
playwright/.cache/
```

### Step 7: Update package.json Scripts
**Implements**: E2E-004
**Files**:
- `package.json` - Add E2E scripts

```json
{
  "scripts": {
    "test:unit": "vitest run --config vitest.config.ts tests/unit",
    "test:integration": "vitest run --config vitest.config.ts tests/integration",
    "test:e2e": "bddgen && playwright test",
    "test:e2e:ui": "bddgen && playwright test --ui",
    "test:e2e:debug": "bddgen && playwright test --debug"
  }
}
```

### Step 8: Create Test Support Files
**Implements**: E2E-003
**Files**:
- `tests/e2e/support/constants.ts` - Test constants
- `tests/e2e/support/selectors.ts` - Centralized selectors

### Step 9: Create Base Page Object
**Implements**: E2E-003
**Files**:
- `tests/e2e/pages/base.page.ts` - Base page class

```typescript
import type { Page, Locator } from "@playwright/test"

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string = "/") {
    await this.page.goto(path)
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId)
  }
}
```

### Step 10: Create Requirements Page Object
**Implements**: E2E-003
**Files**:
- `tests/e2e/pages/requirements.page.ts` - Requirements page abstraction

Key methods:
- `goto()` - Navigate to requirements page
- `waitForRequirementsLoaded()` - Wait for table data
- `selectDomainFilter(name)` - Select a domain
- `selectSubdomainFilter(name)` - Select a subdomain
- `selectCapabilityFilter(name)` - Select a capability
- `clearAllFilters()` - Click clear all button
- `getTableRows()` - Get data rows (excluding header)
- `getEmptyMessage()` - Get "no requirements" message
- `getColumnHeaders()` - Get table column headers

### Step 11: Create Test Fixtures
**Implements**: E2E-003
**Files**:
- `tests/e2e/fixtures/test.ts` - Custom Playwright fixtures

```typescript
import { test as base } from "playwright-bdd"
import { RequirementsPage } from "../pages/requirements.page"

export const test = base.extend<{ requirementsPage: RequirementsPage }>({
  requirementsPage: async ({ page }, use) => {
    await use(new RequirementsPage(page))
  },
})

export { expect } from "@playwright/test"
```

### Step 12: Create Step Definitions - Common
**Implements**: E2E-003
**Files**:
- `tests/e2e/steps/common.steps.ts` - Background and setup steps

Steps to implement:
- `Given the requirements data is loaded from Airtable`
- `Given I am viewing all requirements`
- `Given I have filters applied`

### Step 13: Create Step Definitions - Filter Actions
**Implements**: E2E-003
**Files**:
- `tests/e2e/steps/filter.steps.ts` - When steps for filtering

Steps to implement:
- `When I open the requirements viewer`
- `When I select a domain filter`
- `When I select a subdomain filter`
- `When I select a capability filter`
- `When I clear all filters`
- `When I apply filters that match no requirements`

### Step 14: Create Step Definitions - Assertions
**Implements**: E2E-003
**Files**:
- `tests/e2e/steps/assertion.steps.ts` - Then steps for assertions

Steps to implement:
- `Then I should see all requirements in a table`
- `Then the table should display columns: ReqID, Title, Domain, Subdomain, Capability, Status, Priority`
- `Then I should see only requirements belonging to that domain`
- `Then I should see only requirements belonging to that subdomain`
- `Then I should see only requirements belonging to that capability`
- `Then I should see only requirements matching both filters`
- `Then I should see all requirements` (after clearing)
- `Then I should see a message "No requirements found"`

### Step 15: Add "Clear All" Button to UI
**Implements**: E2E-006
**Files**:
- `src/components/RequirementsFilter.tsx` - Add Clear All button

```typescript
// Add to props interface
onClearAll?: () => void

// Add button (only visible when filters active)
{hasFilters && (
  <Button
    variant="outline"
    onClick={onClearAll}
    data-testid="clear-all-filters"
  >
    Clear All
  </Button>
)}
```

- `src/pages/ViewAllRequirements.tsx` - Add clear handler

```typescript
const clearAllFilters = useCallback(() => {
  setColumnFilters([])
}, [])
```

### Step 16: Add data-testid Attributes
**Implements**: E2E-003
**Files**:
- `src/components/RequirementsFilter.tsx` - Add test IDs to filters
- `src/components/RequirementsTable.tsx` - Add test IDs to table
- `src/components/ui/multi-select.tsx` - Add test IDs to select components

Test IDs to add:
- `domain-filter` - Domain multi-select
- `subdomain-filter` - Subdomain multi-select
- `capability-filter` - Capability multi-select
- `clear-all-filters` - Clear all button
- `requirements-table` - Table element
- `empty-message` - No requirements message

### Step 17: Generate and Run Tests
**Implements**: E2E-004
**Commands**:
```bash
npm run test:e2e
```

## Acceptance Criteria
- [ ] `npm run test:unit` runs unit tests from `tests/unit/`
- [ ] `npm run test:integration` runs integration tests from `tests/integration/`
- [ ] `npm run test:e2e` generates specs from feature files and runs E2E tests
- [ ] All 7 scenarios in `view-and-filter-requirements.feature` pass
- [ ] "Clear All" button appears when filters are active
- [ ] "Clear All" button resets all filters when clicked
- [ ] Tests run against local dev server (auto-started)
- [ ] Chromium browser only (no Firefox/WebKit)

## Open Questions
None - all questions resolved during planning.

## Decisions Made
1. **playwright-bdd over @cucumber/cucumber**: Simpler setup, Playwright-native, better reporting
2. **Clean Architecture with Page Objects**: Maintainability over minimal setup
3. **Feature files stay in docs/**: Keep requirements documentation co-located
4. **Chromium only**: Faster local development, no CI requirement
5. **data-testid attributes**: More reliable than CSS selectors for Radix components
6. **Reorganize test folders**: Clear separation of unit/integration/e2e tests
7. **Add Clear All button**: Required by feature file scenario "Clear filters"
