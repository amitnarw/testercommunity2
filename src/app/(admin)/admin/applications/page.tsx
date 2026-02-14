'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Users, UserCheck, Clock, UserPlus, FileText } from "lucide-react";
import Link from 'next/link';
import { AppPagination } from '@/components/app-pagination';
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAllTesterApplications, useTesterApplicationCounts } from '@/hooks/useAdmin';

const ITEMS_PER_PAGE = 5;

// Stat Card Component - Displays information only
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor,
  bgColor,
  isLoading,
  isActive
}: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  isLoading?: boolean;
  isActive?: boolean;
}) {
  return (
    <Card 
      className={cn(
        "transition-all relative",
        isActive && "ring-2 ring-primary shadow-md"
      )}
    >
      <CardContent className="p-4">
        {/* Background Icon - absolute, scaled up, semi-transparent */}
        <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150">
          <Icon className={iconColor} />
        </div>
        <div className="flex items-center gap-3">
          {/* Visible Icon for desktop */}
          <div className={cn("p-2 rounded-lg", bgColor, "md:block hidden")}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton Row Component
const SkeletonRow = () => (
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

// Application Table Component
const ApplicationTable = ({ applications, isLoading }: { 
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
            <TableHead><span className="sr-only">Actions</span></TableHead>
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
          <TableHead><span className="sr-only">Actions</span></TableHead>
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
                {app.expertise?.map((e: string) => <Badge key={e} variant="secondary">{e}</Badge>)}
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
                  <DropdownMenuItem className="text-green-600 focus:text-green-600 focus:bg-green-500/10">Approve</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Reject</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Mock data for development - will be replaced by API data
const mockApplications = [
  { id: 1, name: "Maria Garcia", email: "maria@example.com", date: "2024-08-20", experience: "3-5 years", expertise: ["Manual", "Usability"], status: "pending" },
  { id: 2, name: "David Kim", email: "david@example.com", date: "2024-08-19", experience: "5+ years", expertise: ["Automation", "Performance", "API"], status: "pending" },
  { id: 3, name: "Alex Johnson", email: "alex@example.com", date: "2024-08-18", experience: "1-3 years", expertise: ["Manual"], status: "approved" },
  { id: 4, name: "Priya Patel", email: "priya@example.com", date: "2024-08-17", experience: "3-5 years", expertise: ["Security", "Manual"], status: "pending" },
  { id: 5, name: "Michael Chen", email: "michael@example.com", date: "2024-08-16", experience: "5+ years", expertise: ["Automation", "API", "Performance"], status: "approved" },
  { id: 6, name: "Emily White", email: "emily@example.com", date: "2024-08-15", experience: "1-3 years", expertise: ["Usability"], status: "rejected" },
  { id: 7, name: "James Brown", email: "james@example.com", date: "2024-08-14", experience: "3-5 years", expertise: ["Manual", "API"], status: "pending" },
  { id: 8, name: "Olivia Green", email: "olivia@example.com", date: "2024-08-13", experience: "5+ years", expertise: ["Automation", "Security"], status: "approved" },
  { id: 9, name: "William Black", email: "william@example.com", date: "2024-08-12", experience: "0-1 years", expertise: ["Manual"], status: "pending" },
  { id: 10, name: "Sophia Grey", email: "sophia@example.com", date: "2024-08-11", experience: "3-5 years", expertise: ["Performance", "Usability"], status: "rejected" },
];

// Filter type for stat cards
type FilterType = 'all' | 'active' | 'new' | 'pending' | 'approved' | 'rejected';

export default function AdminApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch applications data
  const { data: applicationsData, isLoading } = useAllTesterApplications({
    status: activeTab === 'all' ? undefined : activeTab,
    search: searchQuery || undefined,
  });

  // Fetch counts
  const { data: countsData, isLoading: countsLoading } = useTesterApplicationCounts();

  // Use mock data for now, replace with API data when available
  const applications = applicationsData || mockApplications;
  
  // Get counts from API or use mock data
  const counts = {
    total: countsData?.total || 156,
    active: countsData?.active || 142,
    new: countsData?.new || 12,
    pending: countsData?.pending || 24,
    approved: countsData?.approved || 118,
    rejected: countsData?.rejected || 14,
  };

  // Handle stat card click - sets both filter and tab
  const handleStatCardClick = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    
    // Map filter to tab
    if (filter === 'all') {
      setActiveTab('all');
    } else if (filter === 'active') {
      // Active testers show all approved applications
      setActiveTab('approved');
    } else if (filter === 'new') {
      // New testers (last 7 days) - show all for now
      setActiveTab('all');
    } else {
      setActiveTab(filter);
    }
  };

  // Filter applications based on tab and search
  const filteredApplications = applications.filter((app: any) => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch = !searchQuery || 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">Tester Applications</h2>
          <p className="text-sm sm:text-md text-muted-foreground">Review and process applications from prospective professional testers.</p>
        </div>
      </div>

      {/* Stats Cards - Display information only */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard 
          title="Total Testers" 
          value={counts.total}
          icon={Users}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
          isLoading={countsLoading}
        />
        <StatCard 
          title="Active Testers" 
          value={counts.active}
          icon={UserCheck}
          iconColor="text-green-500"
          bgColor="bg-green-500/10"
          isLoading={countsLoading}
        />
        <StatCard 
          title="New (7 days)" 
          value={counts.new}
          icon={UserPlus}
          iconColor="text-purple-500"
          bgColor="bg-purple-500/10"
          isLoading={countsLoading}
        />
        <StatCard 
          title="Pending Apps" 
          value={counts.pending}
          icon={Clock}
          iconColor="text-amber-500"
          bgColor="bg-amber-500/10"
          isLoading={countsLoading}
        />
      </div>

      <Tabs value={activeTab} className="w-full" onValueChange={(value) => {
        setActiveTab(value);
        setCurrentPage(1);
        // Do NOT update active filter to match tab - only update when stat card is clicked
      }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search applications..." 
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-4 grid grid-cols-1">
          <Card>
            <CardContent className="p-0">
              <ApplicationTable 
                applications={paginatedApplications} 
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
          {!isLoading && paginatedApplications.length > 0 && (
            <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
