import type { RequirementPriority } from "@/types/airtable"

export interface CreateDomainInput {
  name: string
  description?: string
}

export interface CreateSubdomainInput {
  name: string
  domainId: string
  prefix?: string
  description?: string
}

export interface CreateCapabilityInput {
  name: string
  subdomainId: string
  prefix?: string
  description?: string
}

export interface CreateRequirementInput {
  reqId: string
  title: string
  capabilityId: string
  status?: string // Norwegian status value
  priority?: RequirementPriority
  description?: string
}

export interface TestDataIds {
  domainIds: string[]
  subdomainIds: string[]
  capabilityIds: string[]
  requirementIds: string[]
}

export interface TestDataSet {
  ids: TestDataIds
  domain: { id: string; name: string }
  subdomain: { id: string; name: string }
  capability: { id: string; name: string }
  requirements: Array<{ id: string; reqId: string; title: string }>
}
