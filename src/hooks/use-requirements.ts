import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  fetchDomains,
  fetchSubdomains,
  fetchCapabilities,
  fetchRequirements,
} from "@/lib/airtable"
import { resolveHierarchy } from "@/lib/hierarchy"

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

  const requirementsWithHierarchy = React.useMemo(
    () => resolveHierarchy(requirements, domains, subdomains, capabilities),
    [requirements, domains, subdomains, capabilities]
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
