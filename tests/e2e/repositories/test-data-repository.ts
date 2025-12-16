import { AirtableClient } from "../infrastructure/airtable-client"
import { TABLE_NAMES, TEST_PREFIX } from "../config/airtable.config"
import type {
  CreateDomainInput,
  CreateSubdomainInput,
  CreateCapabilityInput,
  CreateRequirementInput,
  TestDataIds,
} from "../types/test-data.types"

interface DomainFields {
  Name: string
  Description?: string
}

interface SubdomainFields {
  Name: string
  Domain: string[]
  Prefix?: string
  Description?: string
}

interface CapabilityFields {
  Name: string
  Subdomain: string[]
  Prefix?: string
  Description?: string
}

interface RequirementFields {
  ReqID: string
  Title: string
  Capability: string[]
  Status?: string
  Priority?: string
  Description?: string
}

export class TestDataRepository {
  constructor(private client: AirtableClient) {}

  // Create operations
  async createDomain(input: CreateDomainInput): Promise<string> {
    const record = await this.client.create<DomainFields>(TABLE_NAMES.domain, {
      Name: input.name,
      Description: input.description,
    })
    return record.id
  }

  async createSubdomain(input: CreateSubdomainInput): Promise<string> {
    const record = await this.client.create<SubdomainFields>(TABLE_NAMES.subdomain, {
      Name: input.name,
      Domain: [input.domainId],
      Prefix: input.prefix,
      Description: input.description,
    })
    return record.id
  }

  async createCapability(input: CreateCapabilityInput): Promise<string> {
    const record = await this.client.create<CapabilityFields>(TABLE_NAMES.capability, {
      Name: input.name,
      Subdomain: [input.subdomainId],
      Prefix: input.prefix,
      Description: input.description,
    })
    return record.id
  }

  async createRequirement(input: CreateRequirementInput): Promise<string> {
    const record = await this.client.create<RequirementFields>(TABLE_NAMES.requirement, {
      ReqID: input.reqId,
      Title: input.title,
      Capability: [input.capabilityId],
      Status: input.status,
      Priority: input.priority,
      Description: input.description,
    })
    return record.id
  }

  // Delete operations
  async deleteDomain(id: string): Promise<void> {
    await this.client.delete(TABLE_NAMES.domain, id)
  }

  async deleteSubdomain(id: string): Promise<void> {
    await this.client.delete(TABLE_NAMES.subdomain, id)
  }

  async deleteCapability(id: string): Promise<void> {
    await this.client.delete(TABLE_NAMES.capability, id)
  }

  async deleteRequirement(id: string): Promise<void> {
    await this.client.delete(TABLE_NAMES.requirement, id)
  }

  // Cleanup operations
  async cleanupStaleTestData(): Promise<void> {
    console.log("Cleaning up stale TEST- prefixed data...")

    // Delete in reverse dependency order
    await this.deleteByPrefix(TABLE_NAMES.requirement, "ReqID")
    await this.deleteByPrefix(TABLE_NAMES.capability, "Name")
    await this.deleteByPrefix(TABLE_NAMES.subdomain, "Name")
    await this.deleteByPrefix(TABLE_NAMES.domain, "Name")

    console.log("Stale test data cleanup complete")
  }

  async deleteAll(ids: TestDataIds): Promise<void> {
    console.log("Deleting test data...")

    // Delete in reverse dependency order
    for (const id of ids.requirementIds) {
      await this.deleteRequirement(id).catch((e) =>
        console.warn(`Failed to delete requirement ${id}:`, e)
      )
    }
    for (const id of ids.capabilityIds) {
      await this.deleteCapability(id).catch((e) =>
        console.warn(`Failed to delete capability ${id}:`, e)
      )
    }
    for (const id of ids.subdomainIds) {
      await this.deleteSubdomain(id).catch((e) =>
        console.warn(`Failed to delete subdomain ${id}:`, e)
      )
    }
    for (const id of ids.domainIds) {
      await this.deleteDomain(id).catch((e) =>
        console.warn(`Failed to delete domain ${id}:`, e)
      )
    }

    console.log("Test data deletion complete")
  }

  private async deleteByPrefix(table: string, field: string): Promise<void> {
    const formula = `FIND("${TEST_PREFIX}", {${field}}) = 1`
    const records = await this.client.list<Record<string, unknown>>(table, formula)

    if (records.length > 0) {
      console.log(`Deleting ${records.length} stale records from ${table}`)
      await this.client.batchDelete(
        table,
        records.map((r) => r.id)
      )
    }
  }
}
