import { TestDataBuilder } from "../builders/test-data-builder"
import type { TestDataSet } from "../types/test-data.types"

export async function createRequirementsViewerTestData(
  builder: TestDataBuilder
): Promise<TestDataSet> {
  return builder
    .domain({
      name: "Education",
      description: "Test domain for E2E testing",
    })
    .subdomain({
      name: "Enrollment",
      prefix: "ENR",
      description: "Test subdomain for enrollment",
    })
    .capability({
      name: "Registration",
      prefix: "REG",
      description: "Test capability for registration",
    })
    .requirement({
      reqId: "REQ-001",
      title: "User can register for courses",
      status: "Godkjent", // Norwegian: Approved
      priority: "Must have",
      description: "Test requirement for E2E",
    })
    .requirement({
      reqId: "REQ-002",
      title: "User can view registration status",
      status: "Utkast", // Norwegian: Draft
      priority: "Should have",
    })
    .build()
}

// Export test data names for use in feature files and steps
export const REQUIREMENTS_VIEWER_TEST_DATA = {
  domain: "TEST-Education",
  subdomain: "TEST-Enrollment",
  capability: "TEST-Registration",
  requirements: {
    first: { reqId: "TEST-REQ-001", title: "User can register for courses" },
    second: { reqId: "TEST-REQ-002", title: "User can view registration status" },
  },
} as const
