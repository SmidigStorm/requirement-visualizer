# Set Up Vitest Unit Tests

**Completed: 2025-12-15**

## Summary
Configure Vitest for unit and integration testing, with tests covering Airtable API calls and hierarchy resolution logic.

## Requirements
- [x] Vitest is configured and runs with `npm test`
- [x] Integration tests verify each Airtable fetch function returns expected data structure
- [x] Unit tests verify hierarchy resolution logic correctly joins entities
- [x] Tests can access Airtable API token from environment

## Architecture Approach
Pragmatic approach: extract testable pure functions, use real API for integration tests.

## Codebase Patterns
- Path alias: `@` maps to `./src` (vite.config.ts:10)
- Environment variables: `import.meta.env.VITE_*` (src/lib/airtable.ts:10-11)
- Types defined in: `src/types/airtable.ts`

## Implementation Steps

### Step 1: Install Vitest and dependencies
**Files**:
- `package.json` - Add vitest, add test script

```bash
npm install -D vitest
```

Add to package.json scripts:
```json
"test": "vitest",
"test:run": "vitest run"
```

### Step 2: Configure Vitest
**Files**:
- `vitest.config.ts` - Create new file

Create vitest.config.ts with:
- Load `.env` file for API credentials
- Configure path alias `@` → `./src`
- Set test include pattern for `tests/` folder

### Step 3: Extract hierarchy resolution logic
**Files**:
- `src/lib/hierarchy.ts` - Create new file with pure function
- `src/hooks/useRequirements.ts` - Import and use extracted function

Extract the hierarchy resolution logic (building maps, joining requirements) into a pure function:
```typescript
export function resolveHierarchy(
  requirements: Requirement[],
  domains: Domain[],
  subdomains: Subdomain[],
  capabilities: Capability[]
): RequirementWithHierarchy[]
```

### Step 4: Create integration tests for Airtable API
**Files**:
- `tests/airtable.integration.test.ts` - Create new file

Test each fetch function:
- `fetchDomains()` returns array with at least 1 domain
- `fetchSubdomains()` returns array with at least 1 subdomain
- `fetchCapabilities()` returns array with at least 1 capability
- `fetchRequirements()` returns array with at least 1 requirement
- Verify specific test data exists (e.g., "User Management" domain)
- Verify record shape (id, name properties present)

### Step 5: Create unit tests for hierarchy resolution
**Files**:
- `tests/hierarchy.unit.test.ts` - Create new file

Test cases:
- Correctly joins requirement → capability → subdomain → domain
- Returns "Unknown" for missing capability
- Returns "Unknown" for missing subdomain
- Returns "Unknown" for missing domain
- Handles empty requirements array
- Handles empty lookup arrays

### Step 6: Verify all tests pass
**Actions**:
- Run `npm test` to execute all tests
- Ensure both integration and unit tests pass

## Acceptance Criteria
- [x] `npm test` runs Vitest successfully
- [x] Integration tests pass against real Airtable API
- [x] Unit tests pass for hierarchy resolution
- [x] Tests verify specific test data ("User Management" domain exists)
- [x] No changes to existing functionality

## Test Data in Airtable
The following test data has been added:

| Table | Records |
|-------|---------|
| Domain | User Management, Reporting |
| Subdomain | Authentication, User Profile, Dashboards |
| Capability | Login, Password Reset, Profile Edit, Usage Metrics |
| Requirement | 5 requirements with various statuses/priorities |

## Decisions Made
- **Test location**: `tests/` folder at project root (user preference)
- **Environment**: Use existing `.env` file for integration tests (user preference)
- **Hook testing**: Extract pure function instead of testing React Query hook (simpler, tests actual logic)
- **Integration tests**: Hit real Airtable API (user preference for confidence in actual connection)
