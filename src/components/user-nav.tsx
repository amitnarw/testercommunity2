"use client";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Shield,
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const handleScroll = () => setOpen(false);
      window.addEventListener("scroll", handleScroll, { capture: true });
      return () =>
        window.removeEventListener("scroll", handleScroll, { capture: true });
    }
  }, [open]);

  const isAdmin = pathname.startsWith("/admin");
  const isPro = pathname.startsWith("/tester");

  const getRoleBadge = () => {
    if (isAdmin)
      return (
        <Badge
          variant="default"
          className="h-5 px-2 text-[10px] bg-red-500/10 text-red-600 border-red-500/10 shadow-none backdrop-blur-sm hover:bg-red-500/20"
        >
          Admin
        </Badge>
      );
    if (isPro)
      return (
        <Badge
          variant="default"
          className="h-5 px-2 text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/10 shadow-none backdrop-blur-sm hover:bg-blue-500/20"
        >
          Tester
        </Badge>
      );
    return (
      <Badge
        variant="secondary"
        className="h-5 px-2 text-[10px] bg-primary/5 text-primary border-primary/10 shadow-none backdrop-blur-sm hover:bg-primary/10"
      >
        Member
      </Badge>
    );
  };

  const BentoItem = ({
    href,
    icon: Icon,
    label,
    className = "",
  }: {
    href: string;
    icon: any;
    label: string;
    className?: string;
  }) => (
    <TransitionLink href={href} className={`block ${className}`}>
      <DropdownMenuItem className="flex flex-col items-center justify-center gap-2 p-3 h-20 rounded-2xl cursor-pointer bg-muted/40 hover:bg-muted/80 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-transparent hover:border-border/50 group focus:bg-muted/80 outline-none">
        <div className="p-2 rounded-full bg-background shadow-sm group-hover:shadow-md transition-shadow ring-1 ring-border/10">
          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </DropdownMenuItem>
    </TransitionLink>
  );

  const ListItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => (
    <TransitionLink href={href} className="w-full">
      <DropdownMenuItem className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-muted/50 transition-all text-sm font-medium text-muted-foreground hover:text-foreground group focus:bg-muted/50 outline-none">
        <Icon className="h-4 w-4 group-hover:text-primary transition-colors" />
        <span>{label}</span>
      </DropdownMenuItem>
    </TransitionLink>
  );

  const renderContent = () => {
    if (isAdmin) {
      return (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <BentoItem
              href="/admin/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <BentoItem href="/admin/users" icon={Users} label="Users" />
            <BentoItem
              href="/admin/submissions"
              icon={FileCheck}
              label="Submissions"
            />
            <BentoItem
              href="/admin/feedback"
              icon={MessageSquare}
              label="Feedback"
            />
          </div>
          <div className="space-y-1">
            <ListItem
              href="/admin/applications"
              icon={UserPlus}
              label="Applications"
            />
            <ListItem
              href="/admin/suggestions"
              icon={Lightbulb}
              label="Suggestions"
            />
            <ListItem href="/admin/profile" icon={User} label="My Profile" />
          </div>
        </>
      );
    }
    if (isPro) {
      return (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <BentoItem
              href="/tester/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <BentoItem
              href="/tester/projects"
              icon={Briefcase}
              label="Projects"
            />
            <BentoItem
              href="/tester/earnings"
              icon={DollarSign}
              label="Earnings"
            />
            <BentoItem href="/tester/profile" icon={User} label="Profile" />
          </div>
        </>
      );
    }
    return (
      <>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <BentoItem
            href="/dashboard"
            icon={LayoutDashboard}
            label="Developer"
          />
          <BentoItem
            href="/community-dashboard"
            icon={Users2}
            label="Community"
          />
          <BentoItem href="/wallet" icon={Wallet} label="Wallet" />
          <BentoItem href="/profile" icon={User} label="Profile" />
        </div>
        <div className="space-y-1">
          <ListItem href="/billing" icon={Package} label="Plans & Billing" />
          <ListItem href="/support" icon={LifeBuoy} label="Help & Support" />
        </div>
      </>
    );
  };

  if (!session) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild data-loc="UserNav">
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 ring-0 focus-visible:ring-0 outline-none p-0 group"
        >
          <div className="relative">
            <Avatar className="h-9 w-9 border border-black/5 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105">
              <AvatarImage
                src={session?.user?.image || ""}
                alt="User"
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {session?.user?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[340px] p-3 rounded-[24px] bg-white/70 dark:bg-black/70 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-white/5 z-50 origin-top-right mt-2"
        align="end"
        sideOffset={8}
        forceMount
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/5 ring-1 ring-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Current Role
              </span>
              {getRoleBadge()}
            </div>
          </div>
          <TransitionLink href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted/50 text-muted-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TransitionLink>
        </div>

        {/* Dynamic Content */}
        <div className="mb-2">{renderContent()}</div>

        {/* Footer actions */}
        <div className="pt-2 px-1 border-t border-dashed border-border/50">
          <DropdownMenuItem
            onClick={onLogout}
            className="flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer bg-red-500/5 hover:bg-red-500/10 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 font-semibold group outline-none"
          >
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
