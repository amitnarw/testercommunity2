
import { UserProfileForm } from '@/components/user-profile-form';
import { demoUser } from '@/lib/data.tsx';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Your Profile</h1>
                <p className="text-muted-foreground mt-2">
                    Help us tailor your experience. Complete your profile to get the most out of TestTribe.
                </p>
            </header>
            <UserProfileForm user={demoUser} />
        </div>
    </div>
  );
}
