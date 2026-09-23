"use client";

import { AvailableDevelopersSection } from "@/components/handshake/available-developers-section";
import type { HubSubmittedAppResponse } from "@/lib/types";

interface DiscoverSectionProps {
  apps: HubSubmittedAppResponse[];
  isLoading: boolean;
}

/**
 * Discover tab: only new apps available for handshake testing.
 * Outgoing handshake requests live in the Activity tab.
 */
export function DiscoverSection({ apps, isLoading }: DiscoverSectionProps) {
  return (
    <div className="w-full">
      <div className="min-h-[300px]">
        <AvailableDevelopersSection apps={apps} isLoading={isLoading} />
      </div>
    </div>
  );
}
