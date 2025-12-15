import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type ColumnFiltersState,
  type Row,
  type FilterFn,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RequirementWithHierarchy } from "@/types/airtable"

const columnHelper = createColumnHelper<RequirementWithHierarchy>()

// Shared filter function for ID-based filtering
const createIdFilter = (
  idField: keyof RequirementWithHierarchy
): FilterFn<RequirementWithHierarchy> => {
  return (row: Row<RequirementWithHierarchy>, _columnId: string, filterValue: string[]) => {
    if (filterValue.length === 0) return true
    return filterValue.includes(row.original[idField] as string)
  }
}

const columns = [
  columnHelper.accessor("reqId", {
    header: "ReqID",
    cell: (info) => <span className="font-mono">{info.getValue()}</span>,
  }),
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("domainName", {
    header: "Domain",
    filterFn: createIdFilter("domainId"),
  }),
  columnHelper.accessor("subdomainName", {
    header: "Subdomain",
    filterFn: createIdFilter("subdomainId"),
  }),
  columnHelper.accessor("capabilityName", {
    header: "Capability",
    filterFn: createIdFilter("capabilityId"),
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("priority", {
    header: "Priority",
  }),
]

interface RequirementsTableProps {
  data: RequirementWithHierarchy[]
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: (filters: ColumnFiltersState) => void
}

export function RequirementsTable({
  data,
  columnFilters,
  onColumnFiltersChange,
}: RequirementsTableProps) {
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === "function" ? updater(columnFilters) : updater
      onColumnFiltersChange(newFilters)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="rounded-md border" data-testid="requirements-table">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
                data-testid="empty-message"
              >
                No requirements found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
