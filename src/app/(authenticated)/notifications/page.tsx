'use client';

import { notifications as allNotifications } from '@/lib/data';
import { NotificationsPageContent } from '@/components/notifications-page';

export default function NotificationsPage() {
    // Filter for regular user notifications
    const userNotifications = allNotifications.filter(n => 
        n.type === 'new_test' || n.type === 'points_awarded' || n.type === 'test_completed'
    );

    return (
        <NotificationsPageContent
            title="Notifications"
            description="Here's a list of your recent activities in the community."
            notifications={userNotifications}
        />
    );
}
