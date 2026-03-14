
"use client";

import { PageHeader } from "@/components/page-header";
import { UserDataForm } from "@/components/authenticated/profile/user-data-form";
import { ActiveSessions } from "@/components/authenticated/profile/active-sessions";
import { ProfileBentoGrid } from "@/components/profile-bento-grid";

export default function ProfilePage() {
    return (
        <div
            data-loc="ProfilePage"
            className="mx-auto pb-12 max-w-4xl px-4 md:px-6 py-12"
        >
            <PageHeader
                title="Profile"
                backHref="/admin/dashboard"
                className="w-1/2 lg:w-full"
            />
            <div className="mx-auto space-y-12">
                <UserDataForm title="Admin Data" showAdvancedSetup={false} />
                <ActiveSessions />
                <ProfileBentoGrid
                    showReferAndEarn={false}
                    showUpgrade={false}
                    showSupport={false}
                    settingsHref="/admin/settings"
                    supportHref="/admin/support"
                />
            </div>
        </div>
    );
}
