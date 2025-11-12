
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UserProfileForm } from '@/components/user-profile-form';
import { demoUser } from '@/lib/data';

type Device = {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
};

const initialDevices: Device[] = [
    { id: '1', type: 'desktop', browser: 'Chrome', os: 'macOS', lastActive: 'now', isCurrent: true },
    { id: '2', type: 'mobile', browser: 'Safari', os: 'iOS', lastActive: '2 hours ago', isCurrent: false },
    { id: '3', type: 'tablet', browser: 'Chrome', os: 'Android', lastActive: '1 day ago', isCurrent: false },
];

const DeviceIcon = ({ type }: { type: Device['type'] }) => {
    if (type === 'mobile') return <Smartphone className="w-6 h-6 text-muted-foreground" />;
    if (type === 'tablet') return <Tablet className="w-6 h-6 text-muted-foreground" />;
    return <Monitor className="w-6 h-6 text-muted-foreground" />;
};


export default function ProfilePage() {
    const [devices, setDevices] = useState<Device[]>(initialDevices);
    const { toast } = useToast();

    const handleLogoutDevice = (id: string) => {
        setDevices(devices.filter(d => d.id !== id));
        toast({
            title: "Device Logged Out",
            description: "The selected session has been terminated.",
        });
    };

    const handleLogoutAll = () => {
        setDevices(devices.filter(d => d.isCurrent));
        toast({
            title: "All Other Sessions Logged Out",
            description: "You have been logged out from all other devices.",
        });
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="max-w-3xl mx-auto space-y-12">
                <UserProfileForm user={demoUser} />
                
                <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="px-2">
                        <CardTitle className="text-2xl">Active Sessions</CardTitle>
                        <CardDescription>
                            This is a list of devices that have logged into your account.
                            Revoke any sessions that you do not recognize.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-2">
                        <div className="space-y-4">
                            {devices.map(device => (
                                <div key={device.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                                    <div className="flex items-center gap-4">
                                        <DeviceIcon type={device.type} />
                                        <div>
                                            <p className="font-semibold">{device.browser} on {device.os}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {device.isCurrent ? <span className="text-green-500 font-semibold">This device</span> : `Last active ${device.lastActive}`}
                                            </p>
                                        </div>
                                    </div>
                                    {!device.isCurrent && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <LogOut className="mr-2 h-4 w-4" /> Log out
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will terminate the session on {device.browser} on {device.os}. You will need to log in again on that device.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleLogoutDevice(device.id)}>Log Out</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <div className="flex justify-end">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        Log Out From All Other Devices
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Log Out From All Other Devices?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will terminate all other active sessions for your account. You will remain logged in on this device.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleLogoutAll}>Confirm</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
