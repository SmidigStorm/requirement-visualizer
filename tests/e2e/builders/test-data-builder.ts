import { TestDataRepository } from "../repositories/test-data-repository"
import { TEST_PREFIX } from "../config/airtable.config"
import type {
  CreateDomainInput,
  CreateSubdomainInput,
  CreateCapabilityInput,
  CreateRequirementInput,
  TestDataSet,
  TestDataIds,
} from "../types/test-data.types"

function ensurePrefix(name: string): string {
  return name.startsWith(TEST_PREFIX) ? name : `${TEST_PREFIX}${name}`
}

export class TestDataBuilder {
  private domainInput: CreateDomainInput | null = null
  private subdomainInput: Omit<CreateSubdomainInput, "domainId"> | null = null
  private capabilityInput: Omit<CreateCapabilityInput, "subdomainId"> | null = null
  private requirementInputs: Array<Omit<CreateRequirementInput, "capabilityId">> = []

  constructor(private repository: TestDataRepository) {}

  domain(input: CreateDomainInput): this {
    this.domainInput = {
      ...input,
      name: ensurePrefix(input.name),
    }
    return this
  }

  subdomain(input: Omit<CreateSubdomainInput, "domainId">): this {
    this.subdomainInput = {
      ...input,
      name: ensurePrefix(input.name),
    }
    return this
  }

  capability(input: Omit<CreateCapabilityInput, "subdomainId">): this {
    this.capabilityInput = {
      ...input,
      name: ensurePrefix(input.name),
    }
    return this
  }

  requirement(input: Omit<CreateRequirementInput, "capabilityId">): this {
    this.requirementInputs.push({
      ...input,
      reqId: ensurePrefix(input.reqId),
    })
    return this
  }

  async build(): Promise<TestDataSet> {
    if (!this.domainInput) {
      throw new Error("Domain is required. Call domain() before build()")
    }
    if (!this.subdomainInput) {
      throw new Error("Subdomain is required. Call subdomain() before build()")
    }
    if (!this.capabilityInput) {
      throw new Error("Capability is required. Call capability() before build()")
    }
    if (this.requirementInputs.length === 0) {
      throw new Error("At least one requirement is required. Call requirement() before build()")
    }

    console.log("Building test data hierarchy...")

    // Create in dependency order
    const domainId = await this.repository.createDomain(this.domainInput)
    console.log(`Created domain: ${this.domainInput.name} (${domainId})`)

    const subdomainId = await this.repository.createSubdomain({
      ...this.subdomainInput,
      domainId,
    })
    console.log(`Created subdomain: ${this.subdomainInput.name} (${subdomainId})`)

    const capabilityId = await this.repository.createCapability({
      ...this.capabilityInput,
      subdomainId,
    })
    console.log(`Created capability: ${this.capabilityInput.name} (${capabilityId})`)

    const requirements: Array<{ id: string; reqId: string; title: string }> = []
    for (const reqInput of this.requirementInputs) {
      const requirementId = await this.repository.createRequirement({
        ...reqInput,
        capabilityId,
      })
      console.log(`Created requirement: ${reqInput.reqId} (${requirementId})`)
      requirements.push({
        id: requirementId,
        reqId: reqInput.reqId,
        title: reqInput.title,
      })
    }

    const ids: TestDataIds = {
      domainIds: [domainId],
      subdomainIds: [subdomainId],
      capabilityIds: [capabilityId],
      requirementIds: requirements.map((r) => r.id),
    }

    return {
      ids,
      domain: { id: domainId, name: this.domainInput.name },
      subdomain: { id: subdomainId, name: this.subdomainInput.name },
      capability: { id: capabilityId, name: this.capabilityInput.name },
      requirements,
    }
  }
}
