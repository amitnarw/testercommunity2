import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonRow = () => (
  <TableRow>
    <TableCell className="font-medium">
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell className="hidden sm:table-cell">
      <Skeleton className="h-4 w-32" />
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-14" />
      </div>
    </TableCell>
    <TableCell className="text-right">
      <Skeleton className="h-8 w-8 rounded-md ml-auto" />
    </TableCell>
  </TableRow>
);

export const ApplicationTable = ({
  applications,
  isLoading,
}: {
  applications: any[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Submitted</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </TableBody>
      </Table>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No applications found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Submitted</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Expertise</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app: any) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{app.email}</TableCell>
            <TableCell className="hidden md:table-cell">{app.date}</TableCell>
            <TableCell>{app.experience}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {app.expertise?.map((e: string) => (
                  <Badge key={e} variant="secondary">
                    {e}
                  </Badge>
                ))}
              </div>
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
                  <Link href={`/admin/applications/${app.id}`}>
                    <DropdownMenuItem>View Application</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="text-green-600 focus:text-green-600 focus:bg-green-500/10">
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApplicationTable;
