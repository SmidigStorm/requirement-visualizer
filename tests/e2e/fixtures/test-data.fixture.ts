import { test as base } from "playwright-bdd"
import { REQUIREMENTS_VIEWER_TEST_DATA } from "../data/requirements-viewer.data"

// Simple fixture that just exports test data constants
// Actual data setup/teardown is handled by global-setup.ts and global-teardown.ts
export const test = base

export { REQUIREMENTS_VIEWER_TEST_DATA }
