"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/lib/routes";

const SUPPORT_TABS = [
  { value: ROUTES.ADMIN.SUPPORT, label: "Support Stats" },
  { value: "/admin/support/tickets", label: "Tickets" },
  { value: "/admin/support/live-chat", label: "Live Chat" },
];

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = SUPPORT_TABS.some((t) => t.value === pathname)
    ? pathname
    : ROUTES.ADMIN.SUPPORT;

  return (
    <div className="flex flex-col w-full">
      <div className="px-4 sm:px-6 pt-6 pb-2">
        <Tabs value={currentTab} onValueChange={(v) => router.push(v)}>
          <TabsList>
            {SUPPORT_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {children}
    </div>
  );
}
