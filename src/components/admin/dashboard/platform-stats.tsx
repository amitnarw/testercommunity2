import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Bug, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PlatformStats({
  stats,
  isLoading,
}: {
  stats: any;
  isLoading: boolean;
}) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {stats?.totalUsers?.toLocaleString() || 0}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Submissions</CardTitle>
          <FileText className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {stats?.totalSubmissions?.toLocaleString() || 0}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feedback</CardTitle>
          <Bug className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {stats?.totalFeedback?.toLocaleString() || 0}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Testers</CardTitle>
          <UserCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {stats?.totalTesters?.toLocaleString() || 0}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
