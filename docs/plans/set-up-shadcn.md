# Set up shadcn/ui

## Summary

Install and configure shadcn/ui component library with Tailwind CSS v4 for the Vite + React + TypeScript project.

## Requirements

No formal requirements - this is infrastructure setup.

## Architecture Approach

Follow the official shadcn/ui Vite installation guide using Tailwind CSS v4 with the `@tailwindcss/vite` plugin (not the older PostCSS approach).

## Implementation Steps

### Step 1: Install Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

### Step 2: Update CSS

Replace contents of `src/index.css` with:

```css
@import "tailwindcss";
```

### Step 3: Configure TypeScript path aliases

**tsconfig.json** - Add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**tsconfig.app.json** - Add the same to `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Step 4: Update Vite config

Install Node types:

```bash
npm install -D @types/node
```

Update `vite.config.ts`:

```typescript
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

### Step 5: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

When prompted:
- Base color: **Neutral**
- Accept other defaults

### Step 6: Verify setup

```bash
npm run dev
```

Confirm the app loads without errors.

### Step 7: Commit

```bash
git add .
git commit -m "Set up shadcn/ui with Tailwind CSS v4"
```

## Acceptance Criteria

- [ ] Tailwind CSS v4 installed with `@tailwindcss/vite` plugin
- [ ] Path aliases (`@/*`) working in TypeScript
- [ ] shadcn/ui initialized
- [ ] `npm run dev` runs without errors
- [ ] Project committed to git

## Decisions Made

- **Tailwind version**: v4 with `@tailwindcss/vite` plugin (per official shadcn docs)
- **Base color**: Neutral
- **Initial components**: None - add as needed later

## Notes

- To add components later: `npx shadcn@latest add button`
- Import components using: `import { Button } from "@/components/ui/button"`
