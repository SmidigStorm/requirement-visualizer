import type { RequirementWithHierarchy, RequirementStatus } from "@/types/airtable"

export interface TreemapNode {
  name: string
  value: number
  implemented: number
  percentage: number
  children?: TreemapNode[]
}

// Status that counts as "implemented"
const IMPLEMENTED_STATUS: RequirementStatus = "Done"

// Helper to check if a requirement is implemented
function isImplemented(req: RequirementWithHierarchy): boolean {
  return req.status === IMPLEMENTED_STATUS
}

// Helper to calculate metrics from child nodes
function calculateMetrics(
  children: TreemapNode[]
): Pick<TreemapNode, "value" | "implemented" | "percentage"> {
  const value = children.reduce((sum, c) => sum + c.value, 0)
  const implemented = children.reduce((sum, c) => sum + c.implemented, 0)
  const percentage = value > 0 ? Math.round((implemented / value) * 100) : 0
  return { value, implemented, percentage }
}

// Helper to get or create a map entry
function getOrCreate<K, V>(map: Map<K, V>, key: K, createValue: () => V): V {
  if (!map.has(key)) {
    map.set(key, createValue())
  }
  return map.get(key)!
}

// Type definitions for grouping
interface CapabilityGroup {
  name: string
  requirements: RequirementWithHierarchy[]
}

interface SubdomainGroup {
  name: string
  capabilities: Map<string, CapabilityGroup>
}

interface DomainGroup {
  name: string
  subdomains: Map<string, SubdomainGroup>
}

export function buildTreemapHierarchy(
  requirements: RequirementWithHierarchy[]
): TreemapNode {
  if (requirements.length === 0) {
    return {
      name: "root",
      value: 0,
      implemented: 0,
      percentage: 0,
      children: [],
    }
  }

  // Group by domain -> subdomain -> capability
  const domainMap = new Map<string, DomainGroup>()

  for (const req of requirements) {
    const domain = getOrCreate(domainMap, req.domainId, () => ({
      name: req.domainName,
      subdomains: new Map<string, SubdomainGroup>(),
    }))

    const subdomain = getOrCreate(domain.subdomains, req.subdomainId, () => ({
      name: req.subdomainName,
      capabilities: new Map<string, CapabilityGroup>(),
    }))

    const capability = getOrCreate(
      subdomain.capabilities,
      req.capabilityId,
      () => ({
        name: req.capabilityName,
        requirements: [],
      })
    )

    capability.requirements.push(req)
  }

  // Build hierarchy
  const domainNodes: TreemapNode[] = []

  for (const [, domain] of domainMap) {
    const subdomainNodes: TreemapNode[] = []

    for (const [, subdomain] of domain.subdomains) {
      const capabilityNodes: TreemapNode[] = []

      for (const [, capability] of subdomain.capabilities) {
        const total = capability.requirements.length
        const implemented = capability.requirements.filter(isImplemented).length
        const percentage =
          total > 0 ? Math.round((implemented / total) * 100) : 0

        capabilityNodes.push({
          name: capability.name,
          value: total,
          implemented,
          percentage,
        })
      }

      const subdomainMetrics = calculateMetrics(capabilityNodes)
      subdomainNodes.push({
        name: subdomain.name,
        ...subdomainMetrics,
        children: capabilityNodes,
      })
    }

    const domainMetrics = calculateMetrics(subdomainNodes)
    domainNodes.push({
      name: domain.name,
      ...domainMetrics,
      children: subdomainNodes,
    })
  }

  const rootMetrics = calculateMetrics(domainNodes)
  return {
    name: "root",
    ...rootMetrics,
    children: domainNodes,
  }
}
