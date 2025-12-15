import type {
  Domain,
  Subdomain,
  Capability,
  Requirement,
  RequirementWithHierarchy,
} from "@/types/airtable"

export function resolveHierarchy(
  requirements: Requirement[],
  domains: Domain[],
  subdomains: Subdomain[],
  capabilities: Capability[]
): RequirementWithHierarchy[] {
  const domainMap = new Map<string, Domain>(domains.map((d) => [d.id, d]))
  const subdomainMap = new Map<string, Subdomain>(subdomains.map((s) => [s.id, s]))
  const capabilityMap = new Map<string, Capability>(capabilities.map((c) => [c.id, c]))

  return requirements.map((req) => {
    const capability = capabilityMap.get(req.capabilityId)
    const subdomain = capability ? subdomainMap.get(capability.subdomainId) : undefined
    const domain = subdomain ? domainMap.get(subdomain.domainId) : undefined

    return {
      ...req,
      capabilityName: capability?.name || "Unknown",
      subdomainId: subdomain?.id || "",
      subdomainName: subdomain?.name || "Unknown",
      domainId: domain?.id || "",
      domainName: domain?.name || "Unknown",
    }
  })
}
