import { describe, it, expect } from "vitest"
import { buildTreemapHierarchy, type TreemapNode } from "@/lib/treemap"
import type { RequirementWithHierarchy } from "@/types/airtable"

const createRequirement = (
  overrides: Partial<RequirementWithHierarchy>
): RequirementWithHierarchy => ({
  id: "req1",
  reqId: "REQ-001",
  title: "Test requirement",
  status: "Draft",
  priority: "Must",
  capabilityId: "cap1",
  capabilityName: "Login",
  subdomainId: "sub1",
  subdomainName: "Authentication",
  domainId: "dom1",
  domainName: "User Management",
  ...overrides,
})

describe("buildTreemapHierarchy", () => {
  it("returns empty root for empty requirements", () => {
    const result = buildTreemapHierarchy([])

    expect(result).toEqual({
      name: "root",
      value: 0,
      implemented: 0,
      percentage: 0,
      children: [],
    })
  })

  it("builds correct hierarchy with single requirement", () => {
    const requirements = [createRequirement({ status: "Done" })]

    const result = buildTreemapHierarchy(requirements)

    expect(result.name).toBe("root")
    expect(result.value).toBe(1)
    expect(result.implemented).toBe(1)
    expect(result.percentage).toBe(100)

    expect(result.children).toHaveLength(1)
    const domain = result.children![0]
    expect(domain.name).toBe("User Management")
    expect(domain.value).toBe(1)

    expect(domain.children).toHaveLength(1)
    const subdomain = domain.children![0]
    expect(subdomain.name).toBe("Authentication")

    expect(subdomain.children).toHaveLength(1)
    const capability = subdomain.children![0]
    expect(capability.name).toBe("Login")
    expect(capability.value).toBe(1)
    expect(capability.implemented).toBe(1)
    expect(capability.percentage).toBe(100)
  })

  it("calculates correct counts for multiple requirements", () => {
    const requirements = [
      createRequirement({ id: "r1", status: "Done" }),
      createRequirement({ id: "r2", status: "Draft" }),
      createRequirement({ id: "r3", status: "Approved" }),
      createRequirement({ id: "r4", status: "Done" }),
    ]

    const result = buildTreemapHierarchy(requirements)

    expect(result.value).toBe(4)
    expect(result.implemented).toBe(2)
    expect(result.percentage).toBe(50)

    const capability = result.children![0].children![0].children![0]
    expect(capability.value).toBe(4)
    expect(capability.implemented).toBe(2)
    expect(capability.percentage).toBe(50)
  })

  it("groups by domain, subdomain, capability", () => {
    const requirements = [
      createRequirement({
        id: "r1",
        domainId: "dom1",
        domainName: "Domain A",
        subdomainId: "sub1",
        subdomainName: "Sub A",
        capabilityId: "cap1",
        capabilityName: "Cap 1",
      }),
      createRequirement({
        id: "r2",
        domainId: "dom1",
        domainName: "Domain A",
        subdomainId: "sub1",
        subdomainName: "Sub A",
        capabilityId: "cap2",
        capabilityName: "Cap 2",
      }),
      createRequirement({
        id: "r3",
        domainId: "dom1",
        domainName: "Domain A",
        subdomainId: "sub2",
        subdomainName: "Sub B",
        capabilityId: "cap3",
        capabilityName: "Cap 3",
      }),
      createRequirement({
        id: "r4",
        domainId: "dom2",
        domainName: "Domain B",
        subdomainId: "sub3",
        subdomainName: "Sub C",
        capabilityId: "cap4",
        capabilityName: "Cap 4",
      }),
    ]

    const result = buildTreemapHierarchy(requirements)

    expect(result.children).toHaveLength(2)

    const domainA = result.children!.find((d) => d.name === "Domain A")
    expect(domainA).toBeDefined()
    expect(domainA!.children).toHaveLength(2)
    expect(domainA!.value).toBe(3)

    const subA = domainA!.children!.find((s) => s.name === "Sub A")
    expect(subA).toBeDefined()
    expect(subA!.children).toHaveLength(2)
    expect(subA!.value).toBe(2)

    const domainB = result.children!.find((d) => d.name === "Domain B")
    expect(domainB).toBeDefined()
    expect(domainB!.value).toBe(1)
  })

  it("only counts Done status as implemented", () => {
    const requirements = [
      createRequirement({ id: "r1", status: "Done" }),
      createRequirement({ id: "r2", status: "Draft" }),
      createRequirement({ id: "r3", status: "Review" }),
      createRequirement({ id: "r4", status: "Approved" }),
      createRequirement({ id: "r5", status: "Implementing" }),
      createRequirement({ id: "r6", status: "Deprecated" }),
    ]

    const result = buildTreemapHierarchy(requirements)

    expect(result.value).toBe(6)
    expect(result.implemented).toBe(1)
    expect(result.percentage).toBe(17)
  })

  it("calculates percentage at all hierarchy levels", () => {
    const requirements = [
      createRequirement({
        id: "r1",
        status: "Done",
        domainId: "dom1",
        subdomainId: "sub1",
        capabilityId: "cap1",
      }),
      createRequirement({
        id: "r2",
        status: "Draft",
        domainId: "dom1",
        subdomainId: "sub1",
        capabilityId: "cap1",
      }),
      createRequirement({
        id: "r3",
        status: "Done",
        domainId: "dom1",
        subdomainId: "sub1",
        capabilityId: "cap2",
        capabilityName: "Cap 2",
      }),
    ]

    const result = buildTreemapHierarchy(requirements)

    // Root level: 2/3 = 67%
    expect(result.percentage).toBe(67)

    // Domain level: 2/3 = 67%
    const domain = result.children![0]
    expect(domain.percentage).toBe(67)

    // Subdomain level: 2/3 = 67%
    const subdomain = domain.children![0]
    expect(subdomain.percentage).toBe(67)

    // Capability 1: 1/2 = 50%
    const cap1 = subdomain.children!.find((c) => c.name === "Login")
    expect(cap1!.percentage).toBe(50)

    // Capability 2: 1/1 = 100%
    const cap2 = subdomain.children!.find((c) => c.name === "Cap 2")
    expect(cap2!.percentage).toBe(100)
  })

  it("handles Unknown hierarchy values", () => {
    const requirements = [
      createRequirement({
        domainId: "",
        domainName: "Unknown",
        subdomainId: "",
        subdomainName: "Unknown",
        capabilityId: "cap1",
        capabilityName: "Unknown",
      }),
    ]

    const result = buildTreemapHierarchy(requirements)

    expect(result.children).toHaveLength(1)
    expect(result.children![0].name).toBe("Unknown")
    expect(result.children![0].children![0].name).toBe("Unknown")
    expect(result.children![0].children![0].children![0].name).toBe("Unknown")
  })

  it("handles zero requirements in capability (percentage stays 0)", () => {
    const result = buildTreemapHierarchy([])

    expect(result.percentage).toBe(0)
  })
})
