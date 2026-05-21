import { ProfileSetupView } from "@/components/profile-setup/profile-setup-view";
import { ROUTES } from "@/lib/routes";

export default function ProfileSetupPage() {
  return <ProfileSetupView backHref="/profile" dashboardHref={ROUTES.AUTHENTICATED.COMMUNITY_DASHBOARD} />;
}
