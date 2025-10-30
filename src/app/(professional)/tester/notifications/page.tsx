'use client';

import { notifications as allNotifications } from '@/lib/data';
import { NotificationsPageContent } from '@/components/notifications-page';

export default function ProTesterNotificationsPage() {
    // Filter for professional tester notifications
    const proNotifications = allNotifications.filter(n => 
        n.type === 'new_test' || n.type === 'payment_processed' || n.type === 'test_completed'
    ).map(n => {
        if(n.type === 'new_test') return {...n, title: 'New Professional Project Available!', description: `Project "${n.description.split('"')[1]}" is now open for professional testing.`}
        if(n.type === 'payment_processed') return {...n, title: 'Payment Processed', description: `Your payment for project "${n.description.split('"')[1]}" has been sent.`}
        return n;
    });

    return (
        <NotificationsPageContent
            title="Pro Tester Notifications"
            description="Updates on new projects, payments, and test cycles."
            notifications={proNotifications}
        />
    );
}
