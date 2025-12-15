import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  fetchDomains,
  fetchSubdomains,
  fetchCapabilities,
  fetchRequirements,
} from "@/lib/airtable"
import type { RequirementWithHierarchy, Domain, Subdomain, Capability } from "@/types/airtable"

export function useRequirements() {
  const domainsQuery = useQuery({
    queryKey: ["domains"],
    queryFn: fetchDomains,
  })

  const subdomainsQuery = useQuery({
    queryKey: ["subdomains"],
    queryFn: fetchSubdomains,
  })

  const capabilitiesQuery = useQuery({
    queryKey: ["capabilities"],
    queryFn: fetchCapabilities,
  })

  const requirementsQuery = useQuery({
    queryKey: ["requirements"],
    queryFn: fetchRequirements,
  })

  const isLoading =
    domainsQuery.isLoading ||
    subdomainsQuery.isLoading ||
    capabilitiesQuery.isLoading ||
    requirementsQuery.isLoading

  const isError =
    domainsQuery.isError ||
    subdomainsQuery.isError ||
    capabilitiesQuery.isError ||
    requirementsQuery.isError

  const error =
    domainsQuery.error ||
    subdomainsQuery.error ||
    capabilitiesQuery.error ||
    requirementsQuery.error

  const domains = domainsQuery.data || []
  const subdomains = subdomainsQuery.data || []
  const capabilities = capabilitiesQuery.data || []
  const requirements = requirementsQuery.data || []

  // Build lookup maps for hierarchy resolution (memoized)
  const domainMap = useMemo(
    () => new Map<string, Domain>(domains.map((d) => [d.id, d])),
    [domains]
  )

  const subdomainMap = useMemo(
    () => new Map<string, Subdomain>(subdomains.map((s) => [s.id, s])),
    [subdomains]
  )

  const capabilityMap = useMemo(
    () => new Map<string, Capability>(capabilities.map((c) => [c.id, c])),
    [capabilities]
  )

  // Resolve hierarchy for each requirement (memoized)
  const requirementsWithHierarchy: RequirementWithHierarchy[] = useMemo(
    () =>
      requirements.map((req) => {
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
      }),
    [requirements, capabilityMap, subdomainMap, domainMap]
  )

  return {
    data: requirementsWithHierarchy,
    domains,
    subdomains,
    capabilities,
    isLoading,
    isError,
    error,
  }
}
