import * as React from "react"
import { useTreemap } from "@/hooks/use-treemap"
import type { TreemapNode } from "@/lib/treemap"

const MIN_DIMENSION = 200

interface TreemapVisualizationProps {
  data: TreemapNode
  className?: string
}

export function TreemapVisualization({
  data,
  className = "",
}: TreemapVisualizationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 600 })

  React.useEffect(() => {
    const element = containerRef.current
    if (!element) return

    let isMounted = true

    const resizeObserver = new ResizeObserver((entries) => {
      if (!isMounted) return

      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({
          width: Math.max(width, MIN_DIMENSION),
          height: Math.max(height, MIN_DIMENSION),
        })
      }
    })

    resizeObserver.observe(element)

    return () => {
      isMounted = false
      resizeObserver.unobserve(element)
      resizeObserver.disconnect()
    }
  }, [])

  const { svgRef } = useTreemap({
    data,
    width: dimensions.width,
    height: dimensions.height,
  })

  return (
    <div
      ref={containerRef}
      className={`w-full h-[600px] ${className}`}
      data-testid="treemap-container"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        data-testid="treemap-svg"
      />
    </div>
  )
}
