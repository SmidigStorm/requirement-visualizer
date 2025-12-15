import { useMemo } from "react"
import { useRequirements } from "@/hooks/use-requirements"
import { buildTreemapHierarchy } from "@/lib/treemap"
import { TreemapVisualization } from "@/components/TreemapVisualization"
import { Skeleton } from "@/components/ui/skeleton"

export function ViewCompleteness() {
  const { data, isLoading, isError, error } = useRequirements()

  const treemapData = useMemo(() => buildTreemapHierarchy(data), [data])

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Requirements Completeness</h1>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Requirements Completeness</h1>
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
      <h1 className="text-2xl font-bold mb-6">Requirements Completeness</h1>
      <div className="mb-4 text-sm text-muted-foreground">
        Total: {treemapData.implemented}/{treemapData.value} requirements
        completed ({treemapData.percentage}%)
      </div>
      <TreemapVisualization data={treemapData} />
    </div>
  )
}
