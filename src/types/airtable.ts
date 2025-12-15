// Airtable record types

export interface Domain {
  id: string
  name: string
  description?: string
}

export interface Subdomain {
  id: string
  name: string
  description?: string
  prefix: string
  domainId: string
}

export interface Capability {
  id: string
  name: string
  description?: string
  prefix: string
  subdomainId: string
}

export type RequirementStatus =
  | "Draft"
  | "Review"
  | "Approved"
  | "Implementing"
  | "Done"
  | "Deprecated"

export type RequirementPriority =
  | "Must"
  | "Should"
  | "Could"
  | "Wont"

export interface Requirement {
  id: string
  reqId: string
  title: string
  description?: string
  status: RequirementStatus
  priority: RequirementPriority
  capabilityId: string
}

export interface RequirementWithHierarchy extends Requirement {
  domainId: string
  domainName: string
  subdomainId: string
  subdomainName: string
  capabilityName: string
}
