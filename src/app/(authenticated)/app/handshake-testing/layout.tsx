"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMyPenalties } from "@/hooks/usePenalty";
import { Skeleton } from "@/components/ui/skeleton";

export default function HandshakeTestingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading } = useMyPenalties();

  // P4 (H4 fix): exempt routes render immediately; everything else blocks
  // behind a skeleton while the penalty lookup is in flight. Previously the
  // target page painted for a full network round-trip before being bounced.
  // S10: only the penalty page stays exempt; the elite-badge page moved to
  // /profile (outside this layout), and campaign detail routes render an
  // Add-ons-only view under penalty.
  const isExempt =
    pathname === "/app/handshake-testing/penalty" ||
    /^\/app\/handshake-testing\/\d+$/.test(pathname);

  useEffect(() => {
    if (isLoading) return;
    if (!data?.isPenalized) return;
    if (isExempt) return;
    // Force redirect to penalty page (full priority per locked decision)
    router.replace("/app/handshake-testing/penalty");
  }, [data?.isPenalized, isLoading, pathname, isExempt, router]);

  if (!isLoading && data?.isPenalized && !isExempt) {
    return null;
  }

  if (isLoading && !isExempt) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
