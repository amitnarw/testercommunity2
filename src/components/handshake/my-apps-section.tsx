"use client";

import { MySubmissionsSection } from "@/components/handshake/my-submissions-section";

/**
 * My Apps tab (owner side): the user's own submissions, nothing else.
 * Incoming handshake requests live in the Activity tab.
 */
export function MyAppsSection() {
  return (
    <div className="space-y-8">
      <section>
        <MySubmissionsSection />
      </section>
    </div>
  );
}
