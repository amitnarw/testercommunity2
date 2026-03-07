"use client";

import { ActiveSessions } from "@/components/authenticated/profile/active-sessions";
import { UserDataForm } from "@/components/authenticated/profile/user-data-form";
import { PageHeader } from "@/components/page-header";
import { ProfileBentoGrid } from "@/components/profile-bento-grid";

export default function ProfilePage() {
  return (
    <div
      data-loc="ProfilePage"
      className="mx-auto pb-12 max-w-4xl px-4 md:px-6 py-12"
    >
      <PageHeader
        title="Profile"
        backHref="/tester/dashboard"
        className="w-1/2 lg:w-full"
      />
      <div className="mx-auto space-y-12">
        <UserDataForm title="Tester Data" />
        <ActiveSessions />
        <ProfileBentoGrid
          showReferAndEarn={false}
          showUpgrade={false}
          settingsHref="/tester/settings"
          supportHref="/tester/support"
        />
      </div>
    </div>
  );
}
