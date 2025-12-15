# Treemap Color Coding

**Completed: 2025-12-15**

## Summary
Add color coding to treemap capability nodes based on completion percentage. Red indicates low completion (0-33%), yellow indicates medium (34-66%), and green indicates high (67-100%). Empty capabilities show gray. Text color adapts for readability.

## Requirements
- [x] VIW-REQ-002: Color coding indicates completion status
  - Completion percentage determines color (0-33% red, 34-66% yellow, 67-100% green)
  - Empty capability shows gray with "0 / 0 (0%)"
  - Text color provides sufficient contrast on colored backgrounds

## Architecture Approach
**Minimal changes** - Keep color logic in `use-treemap.ts` since it's tightly coupled to rendering and follows existing patterns.

## Codebase Patterns
- Constants at top of file: Found in `src/hooks/use-treemap.ts:7-35`
- Color scale using d3: Found in `src/hooks/use-treemap.ts:81-86`
- Fill logic by depth: Found in `src/hooks/use-treemap.ts:99-104`
- Text fill attribute: Found in `src/hooks/use-treemap.ts:131,147`

## Implementation Steps

### Step 1: Add color constants
**Implements**: VIW-REQ-002
**Files**:
- `src/hooks/use-treemap.ts` - Add COLORS constant with completion colors and thresholds

```typescript
// Completion color thresholds and colors
const COLORS = {
  THRESHOLDS: { LOW: 33, HIGH: 67 },
  BACKGROUND: {
    EMPTY: "#94a3b8",  // gray
    LOW: "#ef4444",    // red
    MEDIUM: "#eab308", // yellow
    HIGH: "#22c55e",   // green
  },
  TEXT: {
    DARK: "#1e293b",
    LIGHT: "#ffffff",
  },
} as const
```

### Step 2: Add color utility functions
**Implements**: VIW-REQ-002
**Files**:
- `src/hooks/use-treemap.ts` - Add `getCompletionColor` and `getTextColor` functions

```typescript
function getCompletionColor(percentage: number, total: number): string {
  if (total === 0) return COLORS.BACKGROUND.EMPTY
  if (percentage <= COLORS.THRESHOLDS.LOW) return COLORS.BACKGROUND.LOW
  if (percentage <= COLORS.THRESHOLDS.HIGH) return COLORS.BACKGROUND.MEDIUM
  return COLORS.BACKGROUND.HIGH
}

function getTextColor(percentage: number, total: number): string {
  if (total === 0) return COLORS.TEXT.DARK
  if (percentage <= COLORS.THRESHOLDS.LOW) return COLORS.TEXT.LIGHT
  return COLORS.TEXT.DARK
}
```

### Step 3: Update rectangle fill logic
**Implements**: VIW-REQ-002
**Files**:
- `src/hooks/use-treemap.ts` - Modify fill attribute to use completion colors for capabilities

Change from:
```typescript
.attr("fill", (d) => {
  if (d.depth === DEPTH.ROOT) return "transparent"
  if (d.depth === DEPTH.DOMAIN) return colorScale("domain")
  if (d.depth === DEPTH.SUBDOMAIN) return colorScale("subdomain")
  return colorScale("capability")
})
```

To:
```typescript
.attr("fill", (d) => {
  if (d.depth === DEPTH.ROOT) return "transparent"
  if (d.depth === DEPTH.DOMAIN) return colorScale("domain")
  if (d.depth === DEPTH.SUBDOMAIN) return colorScale("subdomain")
  return getCompletionColor(d.data.percentage, d.data.value)
})
```

### Step 4: Update text color for capabilities
**Implements**: VIW-REQ-002
**Files**:
- `src/hooks/use-treemap.ts` - Update text fill to use dynamic color for capability labels

In the `.each` function for labels, update the name label fill for capabilities:
```typescript
.attr("fill", d.depth === DEPTH.CAPABILITY
  ? getTextColor(nodeData.percentage, nodeData.value)
  : COLORS.TEXT.DARK)
```

And update the metrics text fill:
```typescript
.attr("fill", getTextColor(nodeData.percentage, nodeData.value))
```

### Step 5: Add unit tests
**Implements**: VIW-REQ-002
**Files**:
- `tests/unit/treemap.unit.test.ts` - Add tests for color functions

Test cases:
- Empty capability (0 total) returns gray
- 0% completion returns red
- 33% completion returns red
- 34% completion returns yellow
- 66% completion returns yellow
- 67% completion returns green
- 100% completion returns green
- Text color: white on red, dark on others

## Acceptance Criteria
- [x] Capability with 0-33% completion shows red background
- [x] Capability with 34-66% completion shows yellow background
- [x] Capability with 67-100% completion shows green background
- [x] Capability with 0 requirements shows gray background
- [x] Text is white on red background for readability
- [x] Text is dark on yellow/green/gray backgrounds
- [x] Domain and subdomain nodes remain gray (unchanged)
- [x] Unit tests pass for color functions

## Decisions Made
- **Keep color logic in use-treemap.ts**: Small addition, tightly coupled to rendering, follows existing patterns
- **Only color capabilities**: Parent nodes (Domain/Subdomain) remain gray for visual hierarchy
- **White text on red only**: Red is dark enough to need white text; yellow/green/gray work with dark text
- **Use Tailwind color palette**: Colors match the project's existing Tailwind-based design system
