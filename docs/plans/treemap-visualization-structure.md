# Treemap Visualization Structure

**Completed: 2025-12-15**

## Summary
Implement a treemap visualization showing requirements completeness by Domain > Subdomain > Capability hierarchy. Rectangle sizes based on total requirements count. Each capability displays implemented/total and percentage.

## Requirements
- [x] VIW-REQ-002: View completeness treemap on page load - See treemap with nested rectangles, hierarchy Domain > Subdomain > Capability
- [x] VIW-REQ-002: Treemap shows completeness metrics - Each capability shows total count, implemented count, completion percentage

## Architecture Approach
**Clean Architecture** with three-layer separation:
1. **Domain Layer** (`lib/treemap.ts`) - Pure transformation logic
2. **Presentation Layer** (`hooks/use-treemap.ts`, `components/TreemapVisualization.tsx`) - D3 rendering
3. **Integration Layer** (`pages/ViewCompleteness.tsx`) - Composition and state

**Rationale**: Matches existing patterns (`lib/hierarchy.ts`), enables testable pure functions, prepares for future increments (color coding, filters) as additive changes.

## Codebase Patterns
- Data transformation in `lib/`: Found in `src/lib/hierarchy.ts:9-33`
- Custom hooks for side effects: Found in `src/hooks/use-requirements.ts:11-69`
- Page-level composition: Found in `src/pages/ViewAllRequirements.tsx:8-88`
- Loading/error states: Found in `src/pages/ViewAllRequirements.tsx:36-64`

## Implementation Steps

### Step 1: Install Dependencies
**Implements**: Infrastructure
**Commands**:
```bash
npm install react-router-dom d3
npm install -D @types/d3
```

### Step 2: Add React Router
**Implements**: Navigation infrastructure
**Files**:
- `src/App.tsx` - Wrap with BrowserRouter, add Routes
- `src/components/AppSidebar.tsx` - Add Link navigation, active state

### Step 3: Create Treemap Data Transformation
**Implements**: VIW-REQ-002 (metrics calculation)
**Files**:
- `src/lib/treemap.ts` - Create TreemapNode interface and buildTreemapHierarchy function
  - Group requirements by domain → subdomain → capability
  - Count total and implemented (status === "Done")
  - Calculate percentage
  - Return nested hierarchy for D3

### Step 4: Create D3 Treemap Hook
**Implements**: VIW-REQ-002 (treemap rendering)
**Files**:
- `src/hooks/use-treemap.ts` - D3 treemap layout and SVG rendering
  - useRef for SVG element
  - useEffect for D3 operations
  - d3.hierarchy() and d3.treemap() layout
  - Render rectangles with text labels

### Step 5: Create Treemap Component
**Implements**: VIW-REQ-002 (treemap display)
**Files**:
- `src/components/TreemapVisualization.tsx` - Presentational wrapper
  - Accept data prop
  - Provide container sizing
  - Delegate to useTreemap hook

### Step 6: Create Treemap Page
**Implements**: VIW-REQ-002 (page load)
**Files**:
- `src/pages/ViewCompleteness.tsx` - Page composition
  - Use useRequirements() hook
  - Transform with buildTreemapHierarchy()
  - Handle loading/error states
  - Render TreemapVisualization

### Step 7: Unit Tests
**Implements**: Quality assurance
**Files**:
- `tests/unit/treemap.unit.test.ts` - Test buildTreemapHierarchy
  - Correct aggregation at each level
  - Percentage calculations
  - Empty data handling
  - Unknown hierarchy handling

## Data Flow
```
[Airtable API]
      ↓
[useRequirements hook] ← React Query cache
      ↓
[RequirementWithHierarchy[]]
      ↓
[buildTreemapHierarchy] ← pure transformation
      ↓
[TreemapNode hierarchy]
      ↓
[ViewCompleteness page] ← useMemo
      ↓
[TreemapVisualization component]
      ↓
[useTreemap hook] ← D3 layout
      ↓
[SVG DOM output]
```

## Acceptance Criteria
- [x] Navigate to /completeness via sidebar
- [x] Treemap displays with Domain > Subdomain > Capability hierarchy
- [x] Rectangle sizes proportional to total requirements count
- [x] Each capability shows: name, implemented/total, percentage
- [x] Loading skeleton while data fetches
- [x] Error message if data fetch fails

## Decisions Made
- **React Router**: Needed for multi-page navigation (user confirmed)
- **D3.js**: Chosen for maximum flexibility in treemap customization (user confirmed)
- **Clean Architecture**: Layered approach for testability and future extensibility
- **"Done" = Implemented**: Only "Done" status counts as implemented (user confirmed)
- **Rectangle sizing**: Based on total requirements count (Option A, user confirmed)
- **No color coding**: Deferred to backlog item #5
- **No filters**: Deferred to backlog item #6

## Future Extension Points

### Color Coding (Backlog #5)
- Add `color` field to TreemapNode interface
- Add `getColorForPercentage()` helper in `lib/treemap.ts`
- Apply color in `use-treemap.ts` D3 rendering

### Filter Integration (Backlog #6)
- Add filter state to ViewCompleteness (same pattern as ViewAllRequirements)
- Filter requirements before buildTreemapHierarchy
- Reuse RequirementsFilter component

## Files Summary

**New Files (6)**:
1. `src/lib/treemap.ts` - Data transformation
2. `src/hooks/use-treemap.ts` - D3 rendering hook
3. `src/components/TreemapVisualization.tsx` - Presentation component
4. `src/pages/ViewCompleteness.tsx` - Page component
5. `tests/unit/treemap.unit.test.ts` - Unit tests

**Modified Files (2)**:
1. `src/App.tsx` - Add React Router
2. `src/components/AppSidebar.tsx` - Add navigation
