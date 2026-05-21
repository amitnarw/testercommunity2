"use client";

import { SettingsView } from "@/components/settings/settings-view";
import { ROUTES } from "@/lib/routes";

export default function AdminSettingsPage() {
  return <SettingsView backHref={ROUTES.ADMIN.DASHBOARD} />;
}
