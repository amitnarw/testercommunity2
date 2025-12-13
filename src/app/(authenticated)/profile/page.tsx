
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Save, LogOut, Monitor, Smartphone, Tablet, UserCog } from 'lucide-react';
import type { UserProfileData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
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
import { demoUser } from '@/lib/data';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  first_name: z.string().min(2, 'First name is required.'),
  last_name: z.string().min(2, 'Last name is required.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

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
    if (type === 'mobile') return <Smartphone className="w-8 h-8 text-muted-foreground" />;
    if (type === 'tablet') return <Tablet className="w-8 h-8 text-muted-foreground" />;
    return <Monitor className="w-8 h-8 text-muted-foreground" />;
};


export default function ProfilePage() {
    const { toast } = useToast();
    const [avatar, setAvatar] = useState(demoUser.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026704d');
    const [devices, setDevices] = useState<Device[]>(initialDevices);

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            first_name: demoUser.name?.split(' ')[0] || 'Demo',
            last_name: demoUser.name?.split(' ')[1] || 'User',
            email: demoUser.email || 'demo@example.com',
            phone: '',
            country: '',
        },
    });

    const onSubmit = (data: ProfileFormData) => {
        console.log(data);
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    };

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
            <div className="max-w-4xl mx-auto space-y-12">
                <Card className="overflow-hidden rounded-2xl shadow-xl shadow-primary/5">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="md:col-span-1 bg-secondary/50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r">
                             <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                    <AvatarImage src={avatar} />
                                    <AvatarFallback>{demoUser.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                            </div>
                            <h2 className="text-2xl font-bold mt-4">{demoUser.name}</h2>
                            <p className="text-muted-foreground">{demoUser.email}</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2">
                             <CardHeader>
                                <CardTitle>Profile Settings</CardTitle>
                                <CardDescription>Manage your public profile and account details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 px-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input id="first_name" {...register('first_name')} />
                                        {errors.first_name && <p className="text-xs text-destructive">{errors.first_name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">Last Name</Label>
                                        <Input id="last_name" {...register('last_name')} />
                                        {errors.last_name && <p className="text-xs text-destructive">{errors.last_name.message}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register('email')} />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" {...register('phone')} />
                                        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" {...register('country')} />
                                        {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                                    <div>
                                        <h4 className="font-semibold">Advanced Profile Setup</h4>
                                        <p className="text-xs text-muted-foreground">Add more details about your role and projects to get better matches.</p>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href="/profile/profile-setup">
                                            <UserCog className="mr-2 h-4 w-4" /> Go to Setup
                                        </Link>
                                    </Button>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit">
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </form>
                    </div>
                </Card>
                
                <Card className="bg-transparent border-0 shadow-none">
                    <CardHeader className="px-0">
                        <CardTitle className="text-2xl">Active Sessions</CardTitle>
                        <CardDescription>
                            This is a list of devices that have logged into your account.
                            Revoke any sessions that you do not recognize.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-0">
                        {devices.map(device => (
                            <div key={device.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-xl bg-gradient-to-r from-secondary/30 to-secondary/50 transition-all hover:shadow-lg hover:from-secondary/50">
                                <div className="flex items-center gap-4">
                                    <DeviceIcon type={device.type} />
                                    <div>
                                        <p className="font-semibold">{device.os}</p>
                                        <p className="text-sm text-muted-foreground">{device.browser}</p>
                                    </div>
                                </div>
                                <div className="md:text-center">
                                    <p className="text-sm text-muted-foreground">
                                        {device.isCurrent ? <span className="font-semibold text-green-500">This device</span> : `Last active ${device.lastActive}`}
                                    </p>
                                </div>
                                <div className="flex justify-start md:justify-end">
                                    {!device.isCurrent && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                    <LogOut className="mr-2 h-4 w-4" /> Revoke
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
                            </div>
                        ))}
                        <Separator className="my-6" />
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
