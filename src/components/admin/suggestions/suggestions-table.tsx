import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { StatusBadge, TypeBadge } from "./suggestion-badges";

export function SuggestionsTable({
  suggestions,
  onDelete,
  onUpdateStatus,
}: {
  suggestions: any[];
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">S.N.</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="hidden md:table-cell w-2/5">
            Suggestion
          </TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suggestions.map((item: any, index: number) => (
          <TableRow key={item.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="font-medium">
              <div className="flex flex-col">
                <span>{item.user?.name || "Unknown"}</span>
                <span className="text-xs text-muted-foreground">
                  {item.user?.email}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <TypeBadge type={item.type} />
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              <div className="flex flex-col">
                {item.title && (
                  <span className="font-medium text-foreground">
                    {item.title}
                  </span>
                )}
                <span className="line-clamp-2">{item.message}</span>
              </div>
            </TableCell>
            <TableCell>
              {new Date(item.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Link href={`/admin/suggestions/${item.id}`}>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(item.id, "REVIEWED")}
                  >
                    Mark as Reviewed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(item.id, "IMPLEMENTED")}
                  >
                    Mark as Implemented
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(item.id, "REJECTED")}
                  >
                    Mark as Rejected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete Suggestion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default SuggestionsTable;
