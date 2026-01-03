"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  User,
  LifeBuoy,
  LogOut,
  ChevronDown,
  Package,
  Briefcase,
  DollarSign,
  FileCheck,
  Users,
  UserPlus,
  MessageSquare,
  Lightbulb,
  Wallet,
  Settings,
} from "lucide-react";
import { TransitionLink } from "./transition-link";

interface UserNavProps {
  session?: {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
  } | null;
  onLogout: () => void;
}

export function UserNav({ session, onLogout }: UserNavProps) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isPro = pathname.startsWith("/tester");

  const getNavLinks = () => {
    if (isAdmin) {
      return (
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Admin Menu
          </DropdownMenuLabel>
          <TransitionLink href="/admin/profile">
            <DropdownMenuItem className="h-10">
              <User className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/admin/dashboard">
            <DropdownMenuItem className="h-10">
              <LayoutDashboard className="mr-2" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/admin/users">
            <DropdownMenuItem className="h-10">
              <Users className="mr-2" />
              <span>Users</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/admin/submissions">
            <DropdownMenuItem className="h-10">
              <FileCheck className="mr-2" />
              <span>Submissions</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/admin/applications">
            <DropdownMenuItem className="h-10">
              <UserPlus className="mr-2" />
              <span>Applications</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/admin/feedback">
            <DropdownMenuItem className="h-10">
              <MessageSquare className="mr-2" />
              <span>Feedback</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/admin/suggestions">
            <DropdownMenuItem className="h-10">
              <Lightbulb className="mr-2" />
              <span>Suggestions</span>
            </DropdownMenuItem>
          </TransitionLink>
        </DropdownMenuGroup>
      );
    }
    if (isPro) {
      return (
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Menu
          </DropdownMenuLabel>
          <TransitionLink href="/tester/profile">
            <DropdownMenuItem className="h-10">
              <User className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/tester/dashboard">
            <DropdownMenuItem className="h-10">
              <LayoutDashboard className="mr-2" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/tester/projects">
            <DropdownMenuItem className="h-10">
              <Briefcase className="mr-2" />
              <span>Projects</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/tester/earnings">
            <DropdownMenuItem className="h-10">
              <DollarSign className="mr-2" />
              <span>Earnings</span>
            </DropdownMenuItem>
          </TransitionLink>
        </DropdownMenuGroup>
      );
    }
    return (
      <>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Dashboards
          </DropdownMenuLabel>
          <TransitionLink href="/dashboard">
            <DropdownMenuItem className="h-10">
              <LayoutDashboard className="mr-2" />
              <span>Developer Dashboard</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/community-dashboard">
            <DropdownMenuItem className="h-10">
              <Users2 className="mr-2" />
              <span>Community Hub</span>
            </DropdownMenuItem>
          </TransitionLink>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
            Account
          </DropdownMenuLabel>
          <TransitionLink href="/profile">
            <DropdownMenuItem className="h-10">
              <User className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/wallet">
            <DropdownMenuItem className="h-10">
              <Wallet className="mr-2" />
              <span>My Wallet</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/billing">
            <DropdownMenuItem className="h-10">
              <Package className="mr-2" />
              <span>Buy Packages</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href="/support">
            <DropdownMenuItem className="h-10">
              <LifeBuoy className="mr-2" />
              <span>Support</span>
            </DropdownMenuItem>
          </TransitionLink>
        </DropdownMenuGroup>
      </>
    );
  };

  if (!session) {
    null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto rounded-full p-1.5">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session?.user?.image ?? ""}
                data-ai-hint="user avatar"
                alt="User Avatar"
              />
              <AvatarFallback>
                {session?.user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-xl shadow-xl border-border/10 p-2"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session?.user?.image ?? ""}
                data-ai-hint="user avatar"
                alt="User Avatar"
              />
              <AvatarFallback>
                {session?.user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold leading-none text-foreground">
                {session?.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground mt-1">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {getNavLinks()}
        <DropdownMenuSeparator />
        <TransitionLink href="/settings">
          <DropdownMenuItem className="h-10">
            <Settings className="mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </TransitionLink>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="h-10 text-red-500 focus:bg-red-500/10 focus:text-red-600"
        >
          <LogOut className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
