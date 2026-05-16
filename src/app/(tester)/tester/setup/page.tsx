import { ProfileSetupView } from "@/components/profile-setup/profile-setup-view";

export default function TesterSetupPage() {
  return (
    <ProfileSetupView backHref="/tester/profile" dashboardHref="/tester/dashboard" />
  );
}
