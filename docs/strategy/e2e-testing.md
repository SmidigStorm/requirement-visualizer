# E2E Testing Setup

This document explains the end-to-end testing architecture for the Requirements Visualizer.

## Overview

We use **Playwright** with **playwright-bdd** to write tests in Gherkin syntax (`.feature` files). Tests run against a real Airtable database using TEST-prefixed data that is created before tests and cleaned up after.

## Directory Structure

```
tests/e2e/
├── builders/           # Fluent builders for creating test data
├── config/             # Configuration (Airtable credentials, table names)
├── data/               # Feature-specific test data definitions
├── fixtures/           # Playwright fixtures (page objects, test data)
├── infrastructure/     # Low-level API clients
├── pages/              # Page Object Models
├── repositories/       # Data access layer for test data CRUD
├── steps/              # Step definitions for Gherkin scenarios
├── support/            # Shared constants and selectors
├── types/              # TypeScript type definitions
├── global-setup.ts     # Runs before all tests (creates test data)
└── global-teardown.ts  # Runs after all tests (cleans up test data)

docs/requirements/      # Gherkin feature files (.feature)
```

## Architecture

The test infrastructure follows **Clean Architecture** principles:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Feature Files                            │
│                    (Gherkin scenarios)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Step Definitions                           │
│            (steps/*.ts - map Gherkin to code)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Page Objects                              │
│              (pages/*.ts - UI interactions)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Fixtures                                │
│           (fixtures/*.ts - dependency injection)                │
└─────────────────────────────────────────────────────────────────┘
```

For test data management:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Global Setup/Teardown                        │
│                  (creates/deletes test data)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Test Data Builder                          │
│              (builders/test-data-builder.ts)                    │
│           Fluent API for building test data sets                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Test Data Repository                         │
│            (repositories/test-data-repository.ts)               │
│          CRUD operations + cleanup by TEST- prefix              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Airtable Client                            │
│             (infrastructure/airtable-client.ts)                 │
│               Low-level HTTP API operations                     │
└─────────────────────────────────────────────────────────────────┘
```

## Key Files Explained

### Feature Files (`docs/requirements/**/*.feature`)

Gherkin scenarios written in human-readable format:

```gherkin
@VIW-REQ-001
Feature: View and Filter Requirements
  Background:
    Given the test data is loaded

  Scenario: Filter requirements by domain
    When I open the requirements viewer
    And I select domain "TEST-Education"
    Then I should see requirement "TEST-REQ-001"
```

### Step Definitions (`tests/e2e/steps/*.ts`)

Map Gherkin steps to Playwright code:

```typescript
// steps/filter.steps.ts
Given("I select domain {string}", async ({ requirementsPage }, domain: string) => {
  await requirementsPage.selectFilter("domain", domain)
})
```

### Page Objects (`tests/e2e/pages/*.ts`)

Encapsulate UI interactions for each page:

```typescript
// pages/requirements.page.ts
export class RequirementsPage extends BasePage {
  async selectFilter(filterType: FilterType, optionName: string) {
    const filter = this.filterLocators[filterType]()
    await filter.click()
    await this.page.locator(`[data-value="${optionName}"]`).click()
  }
}
```

### Fixtures (`tests/e2e/fixtures/*.ts`)

Provide dependencies to tests via Playwright's fixture system:

```typescript
// fixtures/test.ts
export const test = base.extend<Fixtures>({
  requirementsPage: async ({ page }, use) => {
    await use(new RequirementsPage(page))
  },
})
```

### Test Data Builder (`tests/e2e/builders/test-data-builder.ts`)

Fluent API for creating hierarchical test data:

```typescript
const testData = await builder
  .domain({ name: "Education" })
  .subdomain({ name: "Enrollment" })
  .capability({ name: "Registration" })
  .requirement({ reqId: "REQ-001", title: "User can register" })
  .build()
```

### Global Setup/Teardown

- **`global-setup.ts`**: Runs once before all tests
  - Cleans up stale TEST- prefixed data from previous runs
  - Creates fresh test data hierarchy

- **`global-teardown.ts`**: Runs once after all tests
  - Deletes all test data created during the run

## Test Data Strategy

### Naming Convention

All test data uses a `TEST-` prefix:
- Domain: `TEST-Education`
- Subdomain: `TEST-Enrollment`
- Capability: `TEST-Registration`
- Requirements: `TEST-REQ-001`, `TEST-REQ-002`

This allows:
1. Easy identification of test data
2. Safe cleanup without affecting production data
3. Filtering by prefix for bulk operations

### Data Lifecycle

```
1. Global Setup runs
   ├── Delete any stale TEST- data (from crashed runs)
   └── Create fresh TEST- data hierarchy

2. All tests run in parallel
   └── Tests read from shared TEST- data

3. Global Teardown runs
   └── Delete all TEST- data created in setup
```

### Feature-Specific Data (`tests/e2e/data/*.ts`)

Each feature can define its own test data:

```typescript
// data/requirements-viewer.data.ts
export async function createRequirementsViewerTestData(builder) {
  return builder
    .domain({ name: "Education" })
    .subdomain({ name: "Enrollment" })
    .capability({ name: "Registration" })
    .requirement({ reqId: "REQ-001", title: "...", status: "Godkjent" })
    .requirement({ reqId: "REQ-002", title: "...", status: "Utkast" })
    .build()
}
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific feature
npm run test:e2e -- --grep "View and Filter"

# Run with UI (headed mode)
npm run test:e2e -- --headed

# Run with debug
npm run test:e2e -- --debug
```

## Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
export default defineConfig({
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  fullyParallel: true,
  // ...
})
```

### Airtable Config (`tests/e2e/config/airtable.config.ts`)

Loads credentials from `.env`:
- `VITE_AIRTABLE_API_TOKEN`
- `VITE_AIRTABLE_BASE_ID`

## Adding New Tests

1. **Add feature file** in `docs/requirements/`
2. **Add step definitions** in `tests/e2e/steps/`
3. **Add/update page objects** in `tests/e2e/pages/`
4. **Add test data** (if needed) in `tests/e2e/data/`

## Skipping Tests

Use the `@skip` tag in feature files:

```gherkin
@skip
Scenario: Feature not yet implemented
  When I do something
  Then it works
```
