'use client';

import { notifications as allNotifications } from '@/lib/data';
import { NotificationsPageContent } from '@/components/notitications/notifications-page';

export default function AdminNotificationsPage() {
    // Filter for admin-specific notifications
    const adminNotifications = allNotifications.filter(n => 
        n.type === 'bug_report' || n.type === 'feedback_received'
    ).map(n => ({...n, description: `[Admin] ${n.description}`}));

    return (
        <NotificationsPageContent
            title="Admin Notifications"
            description="Updates on platform activity, new submissions, and critical reports."
            notifications={adminNotifications}
        />
    );
}
