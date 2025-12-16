import type {
  Domain,
  Subdomain,
  Capability,
  Requirement,
  RequirementStatus,
  RequirementPriority,
} from "@/types/airtable"

const API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID

if (!API_TOKEN || !BASE_ID) {
  throw new Error(
    "Missing required Airtable configuration. Please set VITE_AIRTABLE_API_TOKEN and VITE_AIRTABLE_BASE_ID environment variables."
  )
}

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`

interface AirtableRecord<T> {
  id: string
  fields: T
}

interface AirtableResponse<T> {
  records: AirtableRecord<T>[]
}

async function fetchTable<T>(tableName: string): Promise<AirtableRecord<T>[]> {
  const allRecords: AirtableRecord<T>[] = []
  let offset: string | undefined

  do {
    const url = new URL(`${BASE_URL}/${tableName}`)
    if (offset) {
      url.searchParams.set("offset", offset)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${tableName}: ${response.statusText}`)
    }

    const data: AirtableResponse<T> & { offset?: string } = await response.json()
    allRecords.push(...data.records)
    offset = data.offset
  } while (offset)

  return allRecords
}

interface DomainFields {
  Name: string
  Description?: string
}

export async function fetchDomains(): Promise<Domain[]> {
  const records = await fetchTable<DomainFields>("Domain")
  return records.map((record) => ({
    id: record.id,
    name: record.fields.Name,
    description: record.fields.Description,
  }))
}

interface SubdomainFields {
  Name: string
  Description?: string
  Prefix?: string
  Domain?: string[]
}

export async function fetchSubdomains(): Promise<Subdomain[]> {
  const records = await fetchTable<SubdomainFields>("Subdomain")
  return records.map((record) => ({
    id: record.id,
    name: record.fields.Name,
    description: record.fields.Description,
    prefix: record.fields.Prefix || "",
    domainId: record.fields.Domain?.[0] || "",
  }))
}

interface CapabilityFields {
  Name: string
  Description?: string
  Prefix?: string
  Subdomain?: string[]
}

export async function fetchCapabilities(): Promise<Capability[]> {
  const records = await fetchTable<CapabilityFields>("Capability")
  return records.map((record) => ({
    id: record.id,
    name: record.fields.Name,
    description: record.fields.Description,
    prefix: record.fields.Prefix || "",
    subdomainId: record.fields.Subdomain?.[0] || "",
  }))
}

interface RequirementFields {
  ReqID: string
  Title: string
  Description?: string
  Status?: string
  Priority?: RequirementPriority
  Capability?: string[]
}

// Map Norwegian status values to English
const STATUS_MAP: Record<string, RequirementStatus> = {
  "Utkast": "Draft",
  "Klar for gjennomgang": "Review",
  "Godkjent": "Approved",
  "Under implementering": "Implementing",
  "Implementert": "Done",
  "Testet": "Tested",
}

function mapStatus(status: string | undefined): RequirementStatus {
  if (!status) return "Draft"
  return STATUS_MAP[status] || "Draft"
}

export async function fetchRequirements(): Promise<Requirement[]> {
  const records = await fetchTable<RequirementFields>("Requirement")
  return records.map((record) => ({
    id: record.id,
    reqId: record.fields.ReqID || "",
    title: record.fields.Title || "",
    description: record.fields.Description,
    status: mapStatus(record.fields.Status),
    priority: record.fields.Priority || "Could have",
    capabilityId: record.fields.Capability?.[0] || "",
  }))
}
