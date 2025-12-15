import { describe, it, expect } from "vitest"
import {
  fetchDomains,
  fetchSubdomains,
  fetchCapabilities,
  fetchRequirements,
} from "@/lib/airtable"

describe("Airtable API Integration Tests", () => {
  describe("fetchDomains", () => {
    it("returns an array of domains", async () => {
      const domains = await fetchDomains()

      expect(Array.isArray(domains)).toBe(true)
      expect(domains.length).toBeGreaterThan(0)
    })

    it("returns domains with expected shape", async () => {
      const domains = await fetchDomains()
      const domain = domains[0]

      expect(domain).toHaveProperty("id")
      expect(domain).toHaveProperty("name")
      expect(typeof domain.id).toBe("string")
      expect(typeof domain.name).toBe("string")
    })

    it("contains User Management domain", async () => {
      const domains = await fetchDomains()
      const userManagement = domains.find((d) => d.name === "User Management")

      expect(userManagement).toBeDefined()
      expect(userManagement?.description).toContain("user accounts")
    })
  })

  describe("fetchSubdomains", () => {
    it("returns an array of subdomains", async () => {
      const subdomains = await fetchSubdomains()

      expect(Array.isArray(subdomains)).toBe(true)
      expect(subdomains.length).toBeGreaterThan(0)
    })

    it("returns subdomains with expected shape", async () => {
      const subdomains = await fetchSubdomains()
      const subdomain = subdomains[0]

      expect(subdomain).toHaveProperty("id")
      expect(subdomain).toHaveProperty("name")
      expect(subdomain).toHaveProperty("prefix")
      expect(subdomain).toHaveProperty("domainId")
    })

    it("contains Authentication subdomain", async () => {
      const subdomains = await fetchSubdomains()
      const auth = subdomains.find((s) => s.name === "Authentication")

      expect(auth).toBeDefined()
      expect(auth?.prefix).toBe("AUTH")
    })
  })

  describe("fetchCapabilities", () => {
    it("returns an array of capabilities", async () => {
      const capabilities = await fetchCapabilities()

      expect(Array.isArray(capabilities)).toBe(true)
      expect(capabilities.length).toBeGreaterThan(0)
    })

    it("returns capabilities with expected shape", async () => {
      const capabilities = await fetchCapabilities()
      const capability = capabilities[0]

      expect(capability).toHaveProperty("id")
      expect(capability).toHaveProperty("name")
      expect(capability).toHaveProperty("prefix")
      expect(capability).toHaveProperty("subdomainId")
    })

    it("contains Login capability", async () => {
      const capabilities = await fetchCapabilities()
      const login = capabilities.find((c) => c.name === "Login")

      expect(login).toBeDefined()
      expect(login?.prefix).toBe("LOGIN")
    })
  })

  describe("fetchRequirements", () => {
    it("returns an array of requirements", async () => {
      const requirements = await fetchRequirements()

      expect(Array.isArray(requirements)).toBe(true)
      expect(requirements.length).toBeGreaterThan(0)
    })

    it("returns requirements with expected shape", async () => {
      const requirements = await fetchRequirements()
      const requirement = requirements[0]

      expect(requirement).toHaveProperty("id")
      expect(requirement).toHaveProperty("reqId")
      expect(requirement).toHaveProperty("title")
      expect(requirement).toHaveProperty("status")
      expect(requirement).toHaveProperty("priority")
      expect(requirement).toHaveProperty("capabilityId")
    })

    it("contains AUTH-LOGIN-001 requirement", async () => {
      const requirements = await fetchRequirements()
      const loginReq = requirements.find((r) => r.reqId === "AUTH-LOGIN-001")

      expect(loginReq).toBeDefined()
      expect(loginReq?.title).toBe("User can log in with email and password")
      expect(loginReq?.status).toBe("Approved")
      expect(loginReq?.priority).toBe("Must")
    })
  })
})
