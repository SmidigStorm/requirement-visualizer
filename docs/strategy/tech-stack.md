# Tech Stack

## Languages

- **TypeScript** - Primary language for type-safe frontend development

## Frameworks

- **React** - UI component library for building the interface
- **Vite** - Build tool and development server

## Data

- **Airtable API** - Source of requirements data, accessed directly from frontend

## Key Libraries

- **D3.js** - Data visualization library for sunburst diagrams, tree views, and network graphs
- **shadcn/ui** - Component library built on Radix UI and Tailwind CSS

## Testing

- **Cucumber** - BDD test framework for writing human-readable feature specifications
- **Playwright** - E2E browser testing automation

## Infrastructure

- **Local only** - Development and deployment runs locally

## Notes

- Direct Airtable API access means API keys will be exposed in the browser. Consider:
  - Using read-only API keys
  - Restricting to specific bases/tables if Airtable supports it
  - Adding a simple backend proxy later if security becomes a concern
