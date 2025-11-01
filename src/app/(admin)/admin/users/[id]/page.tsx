
'use client';

import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Shield, User, Users, CheckCircle, Bug, Lightbulb, Package, Edit, Trash2 } from "lucide-react";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';


const usersData = [
    { id: 1, name: "Tony Stark", email: "tony@stark.io", phone: "555-0110", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=tony", testingPaths: ["Professional"] },
    { id: 2, name: "Bruce Wayne", email: "bruce@wayne.com", phone: "555-0111", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=bruce", testingPaths: ["Professional", "Community"] },
    { id: 10, name: "Stephen Strange", email: "stephen@sanctum.com", phone: "555-0112", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=stephen", testingPaths: ["Community"] },
    { id: 11, name: "Wanda Maximoff", email: "wanda@westview.com", phone: "555-0113", role: "User", status: "Inactive", avatar: "https://i.pravatar.cc/150?u=wanda", testingPaths: ["Community"] },
    { id: 12, name: "Natasha Romanoff", email: "natasha@shield.org", phone: "555-0114", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=natasha", testingPaths: ["Professional"] },
    { id: 13, name: "Steve Rogers", email: "steve@avengers.com", phone: "555-0115", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=steve", testingPaths: ["Community", "Professional"] },
    { id: 14, name: "Thor Odinson", email: "thor@asgard.com", phone: "555-0116", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?u=thor", testingPaths: ["Community"] },
];

const testersData = [
    { id: 3, name: "Peter Parker", email: "peter@dailybugle.com", phone: "555-0117", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=peter", expertise: ["Manual", "Usability"], tests: 25, bugs: 120, suggestions: 30, projects: ["Nexus Browser", "QuantumLeap CRM", "Starlight Editor"] },
    { id: 4, name: "Diana Prince", email: "diana@them.com", phone: "555-0118", role: "Tester", status: "Inactive", avatar: "https://i.pravatar.cc/150?u=diana", expertise: ["Performance"], tests: 12, bugs: 45, suggestions: 10, projects: ["Project Phoenix", "Helios Platform"] },
    { id: 5, name: "Clark Kent", email: "clark@dailyplanet.com", phone: "555-0119", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=clark", expertise: ["Automation", "Security"], tests: 42, bugs: 250, suggestions: 5, projects: ["Odyssey Social", "Aperture Notes"] },
    { id: 6, name: "Harley Quinn", email: "harleen@arkham.net", phone: "555-0120", role: "Tester", status: "Banned", avatar: "https://i.pravatar.cc/150?u=harley", expertise: ["Manual"], tests: 5, bugs: 15, suggestions: 2, projects: ["Black Mesa OS"] },
    { id: 15, name: "Barry Allen", email: "barry@ccpd.com", phone: "555-0121", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=barry", expertise: ["Performance", "API"], tests: 33, bugs: 180, suggestions: 25, projects: ["Blue Sun CRM", "Virtucon Scheduler"] },
    { id: 16, name: "Arthur Curry", email: "arthur@atlantis.com", phone: "555-0122", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=arthur", expertise: ["Manual", "Usability"], tests: 18, bugs: 90, suggestions: 15, projects: ["Soylent Green Delivery", "InGen DB"] },
    { id: 17, name: "Selina Kyle", email: "selina@gotham.com", phone: "555-0123", role: "Tester", status: "Active", avatar: "https://i.pravatar.cc/150?u=selina", expertise: ["Security"], tests: 21, bugs: 110, suggestions: 20, projects: ["Roxxon Energy Tracker", "Massive Dynamic Tools"] },
];

const staffData = [
    { id: 7, name: "Nick Fury", email: "nick@shield.org", phone: "555-0124", role: "Super Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=nick" },
    { id: 8, name: "Maria Hill", email: "maria@shield.org", phone: "555-0125", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=maria" },
    { id: 9, name: "Phil Coulson", email: "phil@shield.org", phone: "555-0126", role: "Moderator", status: "Active", avatar: "https://i.pravatar.cc/150?u=phil" },
    { id: 18, name: "Peggy Carter", email: "peggy@ssr.gov", phone: "555-0127", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?u=peggy" },
    { id: 19, name: "Melinda May", email: "melinda@shield.org", phone: "555-0128", role: "Moderator", status: "Active", avatar: "https://i.pravatar.cc/150?u=melinda" },
];

const allUsers = [...usersData, ...testersData, ...staffData];

type User = typeof allUsers[0];

export default function AdminUserDetailsPage() {
    const params = useParams();
    const user = allUsers.find(u => u.id.toString() === params.id);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | undefined>(user);
    const { toast } = useToast();

    if (!currentUser) {
        notFound();
    }
    
    const handleSaveChanges = () => {
        setIsEditModalOpen(false);
        toast({
            title: "Profile Updated",
            description: `${currentUser.name}'s profile has been successfully updated.`,
        });
    }

    const isTester = 'tests' in currentUser;
    const isUser = 'testingPaths' in currentUser;

    return (
        <>
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
                        <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
                        <p className="text-muted-foreground">Viewing profile for {currentUser.name}.</p>
                    </div>
                </div>
                 <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setIsEditModalOpen(true)}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                    <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                    </Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={currentUser.avatar} />
                                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-bold">{currentUser.name}</h3>
                            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                            <div className="flex gap-2 mt-4">
                               <Badge variant={currentUser.role === "User" || currentUser.role === "Tester" ? "secondary" : "default"}>{currentUser.role}</Badge>
                               <Badge
                                    variant={currentUser.status === 'Banned' || currentUser.status === 'Inactive' ? 'destructive' : 'secondary'}
                                    className={currentUser.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                                >
                                    {currentUser.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <a href={`mailto:${currentUser.email}`} className="hover:underline">{currentUser.email}</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{currentUser.phone}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {isTester && 'tests' in currentUser && (
                         <Card>
                            <CardHeader>
                                <CardTitle>Tester Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Tests Completed</span>
                                    <span className="font-bold text-lg">{currentUser.tests}</span>
                                </div>
                                 <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Bug className="w-4 h-4"/> Bugs Reported</span>
                                    <span className="font-bold text-lg">{currentUser.bugs}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Lightbulb className="w-4 h-4"/> Suggestions Made</span>
                                    <span className="font-bold text-lg">{currentUser.suggestions}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {isUser && 'testingPaths' in currentUser && currentUser.testingPaths && (
                         <Card>
                            <CardHeader>
                                <CardTitle>Testing Paths</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                               {currentUser.testingPaths.map(path => (
                                   <Badge key={path} variant={path === 'Professional' ? 'default' : 'secondary'} className="text-sm py-1 px-3 flex items-center gap-2">
                                       {path === 'Professional' ? <Package className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                       {path}
                                   </Badge>
                               ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
                <div className="lg:col-span-2 space-y-8">
                     {isTester && 'expertise' in currentUser && (
                        <>
                        <Card>
                           <CardHeader>
                               <CardTitle>Areas of Expertise</CardTitle>
                           </CardHeader>
                           <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {currentUser.expertise?.map(e => <Badge key={e} variant="outline" className="text-base py-1 px-3 flex items-center gap-2"><Shield className="w-4 h-4" />{e}</Badge>)}
                                </div>
                           </CardContent>
                       </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Project History</CardTitle>
                                <CardDescription>Projects this tester has contributed to.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Bugs</TableHead>
                                            <TableHead>Suggestions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {'projects' in currentUser && currentUser.projects?.map(project => (
                                            <TableRow key={project}>
                                                <TableCell className="font-medium">{project}</TableCell>
                                                <TableCell>{Math.floor(Math.random() * 10) + 1}</TableCell>
                                                <TableCell>{Math.floor(Math.random() * 5)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        </>
                    )}

                    {!isTester && (
                        <Card>
                            <CardHeader>
                                <CardTitle>User Activity</CardTitle>
                                <CardDescription>Recent actions and submissions by this user.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <div className="text-center py-20 bg-muted rounded-lg">
                                    <p>Activity log for this user is not yet implemented.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                   
                </div>
            </div>
        </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {currentUser.name}</DialogTitle>
                    <DialogDescription>
                        Modify the user's role and status.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <label>Role</label>
                        <Select defaultValue={currentUser.role} onValueChange={(value) => setCurrentUser(prev => prev ? {...prev, role: value} as User : undefined)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="User">User</SelectItem>
                                <SelectItem value="Tester">Tester</SelectItem>
                                <SelectItem value="Moderator">Moderator</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label>Status</label>
                        <Select defaultValue={currentUser.status} onValueChange={(value) => setCurrentUser(prev => prev ? {...prev, status: value} : undefined)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => {
                        setIsEditModalOpen(false)
                        setCurrentUser(user) // Reset changes if cancelled
                    }}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {currentUser?.name}?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the account and all associated data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => {
                             setIsDeleteModalOpen(false);
                             toast({ variant: 'destructive', title: "User Deleted", description: `${currentUser.name} has been permanently deleted.`})
                        }}>
                            <Trash2 className="mr-2 h-4 w-4" /> Permanently Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

    