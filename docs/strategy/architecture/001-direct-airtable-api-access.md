# 1. Direct Airtable API Access

**Status**: accepted

## Context

We need to fetch requirements data from Airtable to display in visualizations. There are two main approaches:

1. **Direct API calls** - Call Airtable's REST API directly from the browser
2. **Backend proxy** - Set up a server that fetches from Airtable and serves data to the frontend

This is a simple visualization tool meant to be lightweight and easy to deploy. Adding a backend increases complexity, hosting costs, and maintenance burden.

## Decision

We will call the Airtable API directly from the frontend JavaScript code.

To mitigate security concerns:
- Use read-only API tokens (Personal Access Tokens with only read scopes)
- Accept that the API token will be visible in browser dev tools
- Rely on Airtable's own rate limiting and access controls

## Consequences

**Positive:**
- Simpler architecture - no backend to build, deploy, or maintain
- Can deploy as a static site (Vercel, Netlify, GitHub Pages)
- Faster development - fewer moving parts
- Lower hosting costs - static hosting is often free

**Negative:**
- API token is exposed in browser - anyone viewing the site can see it
- Limited to read-only operations (which is fine for a visualization tool)
- If the token is abused, would need to rotate it
- Cannot add server-side caching or transformation logic

**Mitigations:**
- If security becomes a concern, we can add a simple proxy later (Vercel/Netlify functions)
- Keep the Airtable base limited to non-sensitive requirements data
