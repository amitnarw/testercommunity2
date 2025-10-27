
'use client';

import { ArrowLeft, Briefcase, Calendar, Edit, Mail, Phone, Shield, User, Users2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// This would normally come from an API call
const allUsers = [
    { id: '1', name: "Tony Stark", email: "tony@stark.io", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=tony", testingPaths: ["Professional"], joinDate: "2023-01-15", phone: "+1 (555) 123-4567", projects: [{ name: "QuantumLeap CRM", status: "Completed" }, { name: "Project Phoenix", status: "In Testing" }] },
    { id: '3', name: "Peter Parker", email: "peter@dailybugle.com", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=peter", expertise: ["Manual", "Usability"], tests: 25, joinDate: "2023-03-20", phone: "+1 (555) 987-6543", projects: [{ name: "Nexus Browser", status: "Completed" }, { name: "Odyssey Social", status: "Completed" }] },
    { id: '7', name: "Nick Fury", email: "nick@shield.org", role: "Super Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=nick", joinDate: "2022-01-01", phone: "+1 (555) 000-0001", projects: [] },
];

export default function AdminUserDetailsPage() {
    const params = useParams();
    const { id } = params;
    const user = allUsers.find(u => u.id === id);

    if (!user) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to users</span>
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
                        <p className="text-muted-foreground">Viewing details for {user.name}.</p>
                    </div>
                </div>
                <Button><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-4">
                                <Badge variant={user.status === "Active" ? "secondary" : "destructive"} className={user.status === 'Active' ? 'bg-green-500/20 text-green-700' : ''}>{user.status}</Badge>
                                <Badge variant="outline">{user.role}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{user.phone}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4 text-sm">
                           <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined</span>
                                <span className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
                            </div>
                            { 'testingPaths' in user && user.testingPaths.length > 0 &&
                             <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Paths</span>
                                <div className="flex flex-wrap gap-1">
                                    {user.testingPaths.map(path => (
                                        <Badge key={path} variant="outline">{path}</Badge>
                                    ))}
                                </div>
                            </div>}
                            { 'expertise' in user && user.expertise.length > 0 &&
                             <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2"><Shield className="w-4 h-4" /> Expertise</span>
                                 <div className="flex flex-wrap gap-1">
                                    {user.expertise.map(e => <Badge key={e} variant="secondary">{e}</Badge>)}
                                </div>
                            </div>}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity</CardTitle>
                            <CardDescription>An overview of the user's recent activity on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">Activity feed to be implemented.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Associated Projects</CardTitle>
                             <CardDescription>Projects this user is participating in or has submitted.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.projects.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Project Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {user.projects.map((project, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{project.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant={project.status === "Completed" ? "secondary" : "default"} className={project.status === "Completed" ? "bg-green-500/20 text-green-700" : ""}>{project.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href="#">View Project</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-12 bg-secondary rounded-lg">
                                    <p className="text-sm text-muted-foreground">This user is not associated with any projects yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
