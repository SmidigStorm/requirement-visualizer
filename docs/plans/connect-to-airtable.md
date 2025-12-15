# Connect to Airtable

## Summary

Fetch requirements hierarchy (Domain → Subdomain → Capability → Requirement) from Airtable and display in a filterable table.

## Requirements

- [ ] VIW-REQ-001: View and Filter Requirements

## Architecture Approach

- Direct Airtable API calls from frontend (per ADR-001)
- TanStack Query for data fetching with caching and loading states
- TanStack Table for table rendering with built-in filtering
- Hardcoded API token (local development only)

## Codebase Patterns

- Pages in `src/pages/`
- Components in `src/components/`
- Hooks in `src/hooks/`
- Utilities in `src/lib/`
- shadcn components for UI

## Implementation Steps

### Step 1: Install dependencies

```bash
npm install @tanstack/react-query @tanstack/react-table
```

### Step 2: Create TypeScript types

**Files:**
- `src/types/airtable.ts` - Create new file

Define types for:
- `Domain` - id, name, description
- `Subdomain` - id, name, description, prefix, domainId
- `Capability` - id, name, description, prefix, subdomainId
- `Requirement` - id, reqId, title, description, status, priority, capabilityId
- `RequirementWithHierarchy` - Requirement with resolved domain/subdomain/capability names

### Step 3: Create Airtable client

**Files:**
- `src/lib/airtable.ts` - Create new file

Create functions:
- `fetchDomains()` - Fetch all domains
- `fetchSubdomains()` - Fetch all subdomains
- `fetchCapabilities()` - Fetch all capabilities
- `fetchRequirements()` - Fetch all requirements

Hardcode:
- API token
- Base ID: `appNiuZvIRl0rk1JC`

### Step 4: Set up TanStack Query

**Files:**
- `src/main.tsx` - Modify to add QueryClientProvider

Wrap app with QueryClientProvider.

### Step 5: Create custom hooks

**Files:**
- `src/hooks/useRequirements.ts` - Create new file

Create hook that:
- Fetches all tables in parallel
- Resolves hierarchy (joins requirement → capability → subdomain → domain)
- Returns `RequirementWithHierarchy[]`

### Step 6: Add shadcn components for filtering

```bash
npx shadcn@latest add popover command badge
```

**Files:**
- `src/components/ui/multi-select.tsx` - Create reusable multi-select using Popover + Command
- `src/components/RequirementsFilter.tsx` - Create new file

Multi-select component using shadcn Popover + Command (combobox pattern):
- Popover for dropdown
- Command for searchable list
- Badge for selected items

Filter component with:
- Domain multi-select
- Subdomain multi-select
- Capability multi-select

### Step 7: Create TanStack Table component

**Files:**
- `src/components/RequirementsTable.tsx` - Create new file

Table with columns:
- ReqID
- Title
- Domain
- Subdomain
- Capability
- Status
- Priority

Built-in filtering via TanStack Table.

### Step 8: Update ViewAllRequirements page

**Files:**
- `src/pages/ViewAllRequirements.tsx` - Modify

Changes:
- Remove placeholder data
- Use `useRequirements` hook
- Add filter state
- Render `RequirementsFilter` and `RequirementsTable`
- Add loading state (skeleton)
- Add error state
- Add empty state ("No requirements found")

## Acceptance Criteria

- [ ] App fetches real data from Airtable on load
- [ ] Table displays: ReqID, Title, Domain, Subdomain, Capability, Status, Priority
- [ ] Can filter by domain (multi-select)
- [ ] Can filter by subdomain (multi-select)
- [ ] Can filter by capability (multi-select)
- [ ] Filters can be combined
- [ ] Loading state shown while fetching
- [ ] Error state shown if fetch fails
- [ ] "No requirements found" shown when filters match nothing

## Decisions Made

- **API Token**: Hardcoded for now (local dev only)
- **Data fetching**: TanStack Query (caching, loading states, error handling)
- **Table**: TanStack Table (built-in filtering, sortable later)
- **Filter UI**: shadcn Popover + Command pattern for multi-select

## Airtable Reference

- **Base ID**: `appNiuZvIRl0rk1JC`
- **Tables**: Domain, Subdomain, Capability, Requirement
