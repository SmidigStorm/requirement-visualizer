import { MultiSelect } from "@/components/ui/multi-select"
import type { Domain, Subdomain, Capability } from "@/types/airtable"

interface RequirementsFilterProps {
  domains: Domain[]
  subdomains: Subdomain[]
  capabilities: Capability[]
  selectedDomains: string[]
  selectedSubdomains: string[]
  selectedCapabilities: string[]
  onDomainsChange: (selected: string[]) => void
  onSubdomainsChange: (selected: string[]) => void
  onCapabilitiesChange: (selected: string[]) => void
}

const toSelectOptions = <T extends { id: string; name: string }>(items: T[]) =>
  items.map((item) => ({ value: item.id, label: item.name }))

export function RequirementsFilter({
  domains,
  subdomains,
  capabilities,
  selectedDomains,
  selectedSubdomains,
  selectedCapabilities,
  onDomainsChange,
  onSubdomainsChange,
  onCapabilitiesChange,
}: RequirementsFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Domain</label>
        <MultiSelect
          options={toSelectOptions(domains)}
          selected={selectedDomains}
          onChange={onDomainsChange}
          placeholder="Filter by domain..."
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Subdomain</label>
        <MultiSelect
          options={toSelectOptions(subdomains)}
          selected={selectedSubdomains}
          onChange={onSubdomainsChange}
          placeholder="Filter by subdomain..."
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-2 block">Capability</label>
        <MultiSelect
          options={toSelectOptions(capabilities)}
          selected={selectedCapabilities}
          onChange={onCapabilitiesChange}
          placeholder="Filter by capability..."
        />
      </div>
    </div>
  )
}
