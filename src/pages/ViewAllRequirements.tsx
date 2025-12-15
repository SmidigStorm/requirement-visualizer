import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const placeholderData = [
  { reqId: "ADM-GRD-001", title: "User can view grades", status: "Done", priority: "Must" },
  { reqId: "ADM-GRD-002", title: "User can filter by status", status: "Implementing", priority: "Should" },
  { reqId: "ADM-GRD-003", title: "User can export to PDF", status: "Draft", priority: "Could" },
]

export function ViewAllRequirements() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View All Requirements</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ReqID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholderData.map((req) => (
            <TableRow key={req.reqId}>
              <TableCell className="font-mono">{req.reqId}</TableCell>
              <TableCell>{req.title}</TableCell>
              <TableCell>{req.status}</TableCell>
              <TableCell>{req.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
