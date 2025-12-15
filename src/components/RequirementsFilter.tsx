import { MultiSelect } from "@/components/ui/multi-select"
import { Button } from "@/components/ui/button"
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
  onClearAll?: () => void
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
  onClearAll,
}: RequirementsFilterProps) {
  const hasFilters =
    selectedDomains.length > 0 ||
    selectedSubdomains.length > 0 ||
    selectedCapabilities.length > 0

  const filterConfigs = [
    {
      label: "Domain",
      testId: "domain-filter",
      options: toSelectOptions(domains),
      selected: selectedDomains,
      onChange: onDomainsChange,
      placeholder: "Filter by domain...",
    },
    {
      label: "Subdomain",
      testId: "subdomain-filter",
      options: toSelectOptions(subdomains),
      selected: selectedSubdomains,
      onChange: onSubdomainsChange,
      placeholder: "Filter by subdomain...",
    },
    {
      label: "Capability",
      testId: "capability-filter",
      options: toSelectOptions(capabilities),
      selected: selectedCapabilities,
      onChange: onCapabilitiesChange,
      placeholder: "Filter by capability...",
    },
  ]

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {filterConfigs.map((config) => (
        <div key={config.testId} className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block">{config.label}</label>
          <MultiSelect
            data-testid={config.testId}
            options={config.options}
            selected={config.selected}
            onChange={config.onChange}
            placeholder={config.placeholder}
          />
        </div>
      ))}
      {hasFilters && onClearAll && (
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClearAll}
            data-testid="clear-all-filters"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
