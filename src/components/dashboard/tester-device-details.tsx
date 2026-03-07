"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppPagination } from "@/components/app-pagination";
import type { Project } from "@/lib/types";

const TESTERS_PER_PAGE = 10;

export function TesterDeviceDetails({
  testers,
}: {
  testers: Project["testers"];
}) {
  const [testersPage, setTestersPage] = useState(1);
  const totalTestersPages = Math.ceil(testers.length / TESTERS_PER_PAGE);
  const testersStartIndex = (testersPage - 1) * TESTERS_PER_PAGE;
  const testersEndIndex = testersStartIndex + TESTERS_PER_PAGE;
  const currentTesters = testers.slice(testersStartIndex, testersEndIndex);

  const handleTestersPageChange = (page: number) => {
    if (page < 1 || page > totalTestersPages) return;
    setTestersPage(page);
  };

  return (
    <div className="mt-14 bg-card sm:bg-card/0 p-3 rounded-xl">
      <Card className="bg-card/0 border-0 shadow-none">
        <CardHeader className="p-0">
          <CardTitle className="text-xl sm:text-2xl">
            Tester &amp; Device Details
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Comprehensive information about the testers and devices in your
            project.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-4 space-y-4 md:hidden">
        {currentTesters.length > 0 ? (
          currentTesters.map((tester) => (
            <Card
              key={tester.id}
              className="rounded-xl overflow-hidden bg-card shadow-[0_0_20px_rgba(0,0,0,0.2)] shadow-gray-100 dark:shadow-gray-900 border border-gray-100/80 dark:border-gray-900/80"
            >
              <CardHeader className="flex flex-row items-center gap-4 bg-secondary/50 p-3 sm:p-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={tester.avatar} />
                  <AvatarFallback>{tester.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{tester.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tester.country}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{tester.rating.toFixed(1)}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 text-sm grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground">Device</p>
                  <p className="text-xs">{tester.device}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">OS</p>
                  <p className="text-xs">{tester.os}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Screen</p>
                  <p className="text-xs">{tester.screenSize}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Language</p>
                  <p className="text-xs">{tester.language}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">RAM</p>
                  <p className="text-xs">{tester.ram}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Network</p>
                  <Badge
                    variant={
                      tester.network === "WiFi" ? "secondary" : "outline"
                    }
                  >
                    {tester.network}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No tester data available.
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl shadow-sm bg-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto grid grid-cols-1">
          <Table>
            <TableHeader>
              <TableRow className="!border-b-[8px] border-[#f8fafc] dark:border-[#0f151e]">
                <TableHead className="py-6">Tester</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Screen</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Network</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTesters.length > 0 ? (
                currentTesters.map((tester) => (
                  <TableRow
                    key={tester.id}
                    className="border-b-gray-100 dark:border-b-gray-900"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={tester.avatar} />
                          <AvatarFallback>
                            {tester.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{tester.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tester.country}</TableCell>
                    <TableCell>{tester.device}</TableCell>
                    <TableCell>{tester.ram}</TableCell>
                    <TableCell>{tester.os}</TableCell>
                    <TableCell>{tester.screenSize}</TableCell>
                    <TableCell>{tester.language}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tester.network === "WiFi" ? "secondary" : "outline"
                        }
                      >
                        {tester.network}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold">
                          {tester.rating.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No tester data available for this project yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="p-0 mt-4">
        <AppPagination
          currentPage={testersPage}
          totalPages={totalTestersPages}
          onPageChange={handleTestersPageChange}
        />
      </div>
    </div>
  );
}
