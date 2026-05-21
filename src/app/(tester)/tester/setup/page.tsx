import { ProfileSetupView } from "@/components/profile-setup/profile-setup-view";
import { ROUTES } from "@/lib/routes";

export default function TesterSetupPage() {
  return (
    <ProfileSetupView backHref={ROUTES.TESTER.PROFILE} dashboardHref={ROUTES.TESTER.DASHBOARD} />
  );
}
