"use client";

import { SettingsView } from "@/components/settings/settings-view";
import { ROUTES } from "@/lib/routes";

export default function TesterSettingsPage() {
  return <SettingsView backHref={ROUTES.TESTER.PROFILE} />;
}
