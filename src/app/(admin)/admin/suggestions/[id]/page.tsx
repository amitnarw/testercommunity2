"use client";

import { notFound, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Tag, Lightbulb, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { BackButton } from "@/components/back-button";

const suggestionItems = [
  {
    id: 1,
    user: "Tony Stark",
    role: "Developer",
    suggestion: "Add a 'duplicate project' button to easily re-run tests.",
    date: "2024-08-20",
    status: "Received",
  },
  {
    id: 2,
    user: "Harley Quinn",
    role: "Tester",
    suggestion: "Gamify the bug reporting process with points for quality.",
    date: "2024-08-19",
    status: "Planned",
  },
  {
    id: 3,
    user: "Bruce Wayne",
    role: "Developer",
    suggestion: "Integrate with GitHub Actions to trigger tests on PR.",
    date: "2024-08-18",
    status: "In Development",
  },
  {
    id: 4,
    user: "Diana Prince",
    role: "Tester",
    suggestion: "Show tester leaderboards for the month.",
    date: "2024-08-17",
    status: "Shipped",
  },
  {
    id: 5,
    user: "Peter Parker",
    role: "Tester",
    suggestion: "Add a way to directly message developers from a bug report.",
    date: "2024-08-16",
    status: "Received",
  },
];

export default function SuggestionDetailsPage() {
  const params = useParams();
  const { id } = params;
  const item = suggestionItems.find((i) => i.id.toString() === id);

  const [status, setStatus] = useState(item?.status || "Received");

  if (!item) {
    notFound();
  }

  const statusOptions = ["Received", "Planned", "In Development", "Shipped"];

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="sticky top-0 z-[50] pt-2 pb-4 w-1/2">
        <BackButton href="/community-dashboard" />
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/10 bg-clip-text text-transparent">
              Suggestion Details
            </h2>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-3">
              <Edit className="sm:mr-2 !h-3 !w-3 sm:!h-4 sm:!w-4" />
              <span className="hidden sm:block">Change Status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusOptions.map((option) => (
              <DropdownMenuItem key={option} onSelect={() => setStatus(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="rounded-2xl shadow-xl overflow-hidden mt-10">
        <CardHeader className="bg-secondary/30 p-6">
          <CardTitle className="text-lg sm:text-xl">
            Suggestion from {item.user}
          </CardTitle>
          <CardDescription>
            Submitted on {new Date(item.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground">
                  <Lightbulb className="w-5 h-5" /> Content
                </h3>
                <blockquote className="border-l-4 border-primary pl-4 italic bg-secondary p-4 rounded-r-lg">
                  "{item.suggestion}"
                </blockquote>
              </div>
            </div>
            <div className="lg:col-span-1 bg-secondary/50 p-6 space-y-6 border-l">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground">
                  <User className="w-5 h-5" /> Submitted By
                </h3>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-lg">{item.user}</p>
                  <Badge
                    variant={
                      item.role === "Developer" ? "default" : "secondary"
                    }
                  >
                    {item.role}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" /> Submitted On
                </h3>
                <p className="font-medium">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-muted-foreground">
                  <Tag className="w-5 h-5" /> Status
                </h3>
                <Badge
                  variant={status === "Shipped" ? "secondary" : "outline"}
                  className={
                    status === "Shipped"
                      ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : ""
                  }
                >
                  {status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
