import { describe, it, expect } from "vitest"
import { resolveHierarchy } from "@/lib/hierarchy"
import type {
  Domain,
  Subdomain,
  Capability,
  Requirement,
} from "@/types/airtable"

const mockDomains: Domain[] = [
  { id: "dom1", name: "User Management", description: "User features" },
  { id: "dom2", name: "Reporting", description: "Analytics features" },
]

const mockSubdomains: Subdomain[] = [
  { id: "sub1", name: "Authentication", description: "Login", prefix: "AUTH", domainId: "dom1" },
  { id: "sub2", name: "Dashboards", description: "Charts", prefix: "DASH", domainId: "dom2" },
]

const mockCapabilities: Capability[] = [
  { id: "cap1", name: "Login", description: "User login", prefix: "LOGIN", subdomainId: "sub1" },
  { id: "cap2", name: "Usage Metrics", description: "Metrics", prefix: "USAGE", subdomainId: "sub2" },
]

const mockRequirements: Requirement[] = [
  {
    id: "req1",
    reqId: "AUTH-LOGIN-001",
    title: "User can log in",
    status: "Approved",
    priority: "Must",
    capabilityId: "cap1",
  },
  {
    id: "req2",
    reqId: "DASH-USAGE-001",
    title: "Show usage chart",
    status: "Draft",
    priority: "Could",
    capabilityId: "cap2",
  },
]

describe("resolveHierarchy", () => {
  it("correctly joins requirement to capability, subdomain, and domain", () => {
    const result = resolveHierarchy(
      mockRequirements,
      mockDomains,
      mockSubdomains,
      mockCapabilities
    )

    expect(result).toHaveLength(2)

    const loginReq = result.find((r) => r.reqId === "AUTH-LOGIN-001")
    expect(loginReq).toBeDefined()
    expect(loginReq?.capabilityName).toBe("Login")
    expect(loginReq?.subdomainId).toBe("sub1")
    expect(loginReq?.subdomainName).toBe("Authentication")
    expect(loginReq?.domainId).toBe("dom1")
    expect(loginReq?.domainName).toBe("User Management")

    const usageReq = result.find((r) => r.reqId === "DASH-USAGE-001")
    expect(usageReq).toBeDefined()
    expect(usageReq?.capabilityName).toBe("Usage Metrics")
    expect(usageReq?.subdomainName).toBe("Dashboards")
    expect(usageReq?.domainName).toBe("Reporting")
  })

  it("returns 'Unknown' for missing capability", () => {
    const reqWithMissingCap: Requirement[] = [
      {
        id: "req3",
        reqId: "MISSING-001",
        title: "Missing capability",
        status: "Draft",
        priority: "Could",
        capabilityId: "nonexistent",
      },
    ]

    const result = resolveHierarchy(
      reqWithMissingCap,
      mockDomains,
      mockSubdomains,
      mockCapabilities
    )

    expect(result).toHaveLength(1)
    expect(result[0].capabilityName).toBe("Unknown")
    expect(result[0].subdomainName).toBe("Unknown")
    expect(result[0].domainName).toBe("Unknown")
  })

  it("returns 'Unknown' for missing subdomain", () => {
    const capWithMissingSub: Capability[] = [
      { id: "cap3", name: "Orphan Cap", description: "Orphan capability", prefix: "ORP", subdomainId: "nonexistent" },
    ]
    const reqWithOrphanCap: Requirement[] = [
      {
        id: "req4",
        reqId: "ORP-001",
        title: "Orphan requirement",
        status: "Draft",
        priority: "Could",
        capabilityId: "cap3",
      },
    ]

    const result = resolveHierarchy(
      reqWithOrphanCap,
      mockDomains,
      mockSubdomains,
      capWithMissingSub
    )

    expect(result).toHaveLength(1)
    expect(result[0].capabilityName).toBe("Orphan Cap")
    expect(result[0].subdomainName).toBe("Unknown")
    expect(result[0].domainName).toBe("Unknown")
  })

  it("returns 'Unknown' for missing domain", () => {
    const subWithMissingDom: Subdomain[] = [
      { id: "sub3", name: "Orphan Sub", description: "Orphan subdomain", prefix: "OSUB", domainId: "nonexistent" },
    ]
    const capWithOrphanSub: Capability[] = [
      { id: "cap4", name: "Cap in orphan sub", description: "Test capability", prefix: "COS", subdomainId: "sub3" },
    ]
    const req: Requirement[] = [
      {
        id: "req5",
        reqId: "COS-001",
        title: "Req in orphan chain",
        status: "Draft",
        priority: "Could",
        capabilityId: "cap4",
      },
    ]

    const result = resolveHierarchy(req, mockDomains, subWithMissingDom, capWithOrphanSub)

    expect(result).toHaveLength(1)
    expect(result[0].capabilityName).toBe("Cap in orphan sub")
    expect(result[0].subdomainName).toBe("Orphan Sub")
    expect(result[0].domainName).toBe("Unknown")
  })

  it("handles empty requirements array", () => {
    const result = resolveHierarchy([], mockDomains, mockSubdomains, mockCapabilities)

    expect(result).toEqual([])
  })

  it("handles empty lookup arrays", () => {
    const result = resolveHierarchy(mockRequirements, [], [], [])

    expect(result).toHaveLength(2)
    expect(result[0].capabilityName).toBe("Unknown")
    expect(result[0].subdomainName).toBe("Unknown")
    expect(result[0].domainName).toBe("Unknown")
  })
})
