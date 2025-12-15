import * as React from "react"
import * as d3 from "d3"
import type { HierarchyRectangularNode } from "d3"
import type { TreemapNode } from "@/lib/treemap"

// Layout configuration
const LAYOUT = {
  PADDING_TOP: 20,
  PADDING_SIDES: 2,
  PADDING_INNER: 2,
} as const

// Text rendering thresholds
const TEXT = {
  MIN_WIDTH: 30,
  MIN_HEIGHT: 20,
  MIN_HEIGHT_FOR_METRICS: 35,
  PADDING_X: 4,
  AVG_CHAR_WIDTH: 7,
} as const

// Hierarchy depth levels
const DEPTH = {
  ROOT: 0,
  DOMAIN: 1,
  SUBDOMAIN: 2,
  CAPABILITY: 3,
} as const

// Font configuration by depth
const FONT_CONFIG = {
  [DEPTH.DOMAIN]: { size: "12px", weight: "600" },
  [DEPTH.SUBDOMAIN]: { size: "11px", weight: "600" },
  [DEPTH.CAPABILITY]: { size: "10px", weight: "400" },
} as const

// Completion color thresholds and colors
const COLORS = {
  THRESHOLDS: { LOW: 33, HIGH: 66 },
  BACKGROUND: {
    EMPTY: "#94a3b8", // gray
    LOW: "#ef4444", // red
    MEDIUM: "#eab308", // yellow
    HIGH: "#22c55e", // green
  },
  TEXT: {
    DARK: "#1e293b",
    LIGHT: "#ffffff",
  },
} as const

// Get background color based on completion percentage
export function getCompletionColor(percentage: number, total: number): string {
  if (total === 0) return COLORS.BACKGROUND.EMPTY
  if (percentage <= COLORS.THRESHOLDS.LOW) return COLORS.BACKGROUND.LOW
  if (percentage <= COLORS.THRESHOLDS.HIGH) return COLORS.BACKGROUND.MEDIUM
  return COLORS.BACKGROUND.HIGH
}

// Get text color for readability on completion background
export function getTextColor(percentage: number, total: number): string {
  if (total === 0) return COLORS.TEXT.DARK
  if (percentage <= COLORS.THRESHOLDS.LOW) return COLORS.TEXT.LIGHT
  return COLORS.TEXT.DARK
}

interface UseTreemapOptions {
  data: TreemapNode | null
  width: number
  height: number
}

export function useTreemap({ data, width, height }: UseTreemapOptions) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const isMountedRef = React.useRef(true)

  React.useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const render = React.useCallback(() => {
    if (!svgRef.current || !data || width <= 0 || height <= 0) {
      return
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Create hierarchy
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => (d.children ? 0 : d.value))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

    // Create treemap layout and apply it
    const treemapLayout = d3
      .treemap<TreemapNode>()
      .size([width, height])
      .paddingTop(LAYOUT.PADDING_TOP)
      .paddingRight(LAYOUT.PADDING_SIDES)
      .paddingBottom(LAYOUT.PADDING_SIDES)
      .paddingLeft(LAYOUT.PADDING_SIDES)
      .paddingInner(LAYOUT.PADDING_INNER)
      .round(true)

    const root = treemapLayout(hierarchy)

    // Color scale for hierarchy levels
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(["domain", "subdomain", "capability"])
      .range(["#e2e8f0", "#cbd5e1", "#94a3b8"])

    // Create groups for each node
    const nodes = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`)

    // Add rectangles
    nodes
      .append("rect")
      .attr("width", (d) => Math.max(0, d.x1 - d.x0))
      .attr("height", (d) => Math.max(0, d.y1 - d.y0))
      .attr("fill", (d) => {
        if (d.depth === DEPTH.ROOT) return "transparent"
        if (d.depth === DEPTH.DOMAIN) return colorScale("domain")
        if (d.depth === DEPTH.SUBDOMAIN) return colorScale("subdomain")
        return getCompletionColor(d.data.percentage, d.data.value)
      })
      .attr("stroke", "#64748b")
      .attr("stroke-width", (d) => (d.depth <= DEPTH.DOMAIN ? 2 : 1))

    // Add labels for non-root nodes
    nodes
      .filter((d) => d.depth > DEPTH.ROOT)
      .each(function (d: HierarchyRectangularNode<TreemapNode>) {
        const node = d3.select(this)
        const nodeWidth = d.x1 - d.x0
        const nodeHeight = d.y1 - d.y0
        const nodeData = d.data

        // Only add text if there's enough space
        if (nodeWidth < TEXT.MIN_WIDTH || nodeHeight < TEXT.MIN_HEIGHT) return

        const fontConfig =
          FONT_CONFIG[d.depth as keyof typeof FONT_CONFIG] ??
          FONT_CONFIG[DEPTH.CAPABILITY]

        // Add name label at top
        node
          .append("text")
          .attr("x", TEXT.PADDING_X)
          .attr("y", 14)
          .attr("font-size", fontConfig.size)
          .attr("font-weight", fontConfig.weight)
          .attr(
            "fill",
            d.depth === DEPTH.CAPABILITY
              ? getTextColor(nodeData.percentage, nodeData.value)
              : COLORS.TEXT.DARK
          )
          .text(() => {
            const maxChars = Math.floor(nodeWidth / TEXT.AVG_CHAR_WIDTH)
            if (nodeData.name.length > maxChars) {
              return nodeData.name.slice(0, maxChars - 1) + "…"
            }
            return nodeData.name
          })

        // Add metrics for leaf nodes (capabilities)
        if (!d.children && nodeHeight > TEXT.MIN_HEIGHT_FOR_METRICS) {
          node
            .append("text")
            .attr("x", TEXT.PADDING_X)
            .attr("y", nodeHeight - 6)
            .attr("font-size", "9px")
            .attr("fill", getTextColor(nodeData.percentage, nodeData.value))
            .text(
              `${nodeData.implemented}/${nodeData.value} (${nodeData.percentage}%)`
            )
        }
      })
  }, [data, width, height])

  React.useEffect(() => {
    render()
  }, [render])

  return { svgRef }
}
