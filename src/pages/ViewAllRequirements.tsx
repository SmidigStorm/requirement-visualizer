import { useState, useCallback } from "react"
import type { ColumnFiltersState } from "@tanstack/react-table"
import { useRequirements } from "@/hooks/use-requirements"
import { RequirementsFilter } from "@/components/RequirementsFilter"
import { RequirementsTable } from "@/components/RequirementsTable"
import { Skeleton } from "@/components/ui/skeleton"

export function ViewAllRequirements() {
  const { data, domains, subdomains, capabilities, isLoading, isError, error } =
    useRequirements()

  // Single source of truth for filter state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Derive selected values from columnFilters
  const getFilterValue = (id: string): string[] =>
    (columnFilters.find((f) => f.id === id)?.value as string[]) || []

  const selectedDomains = getFilterValue("domainName")
  const selectedSubdomains = getFilterValue("subdomainName")
  const selectedCapabilities = getFilterValue("capabilityName")

  // Update a single filter
  const updateFilter = useCallback((id: string, value: string[]) => {
    setColumnFilters((prev) => {
      const filtered = prev.filter((f) => f.id !== id)
      return value.length > 0 ? [...filtered, { id, value }] : filtered
    })
  }, [])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setColumnFilters([])
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">View All Requirements</h1>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">View All Requirements</h1>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">Error loading requirements</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : "An unknown error occurred"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View All Requirements</h1>
      <RequirementsFilter
        domains={domains}
        subdomains={subdomains}
        capabilities={capabilities}
        selectedDomains={selectedDomains}
        selectedSubdomains={selectedSubdomains}
        selectedCapabilities={selectedCapabilities}
        onDomainsChange={(value) => updateFilter("domainName", value)}
        onSubdomainsChange={(value) => updateFilter("subdomainName", value)}
        onCapabilitiesChange={(value) => updateFilter("capabilityName", value)}
        onClearAll={clearAllFilters}
      />
      <RequirementsTable
        data={data}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
      />
    </div>
  )
}
