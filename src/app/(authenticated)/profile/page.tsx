
import { UserProfileForm } from '@/components/user-profile-form';
import { demoUser } from '@/lib/data.tsx';

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-2xl mx-auto">
            <UserProfileForm user={demoUser} />
        </div>
    </div>
  );
}
