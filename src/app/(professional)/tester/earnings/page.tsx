
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, Banknote, IndianRupee, Landmark } from "lucide-react";

const earningsHistory = [
    { id: 'PAY-001', date: '2024-08-01', project: 'Nexus Browser', amount: 6000, status: 'Paid' },
    { id: 'PAY-002', date: '2024-07-15', project: 'Odyssey Social', amount: 8000, status: 'Paid' },
    { id: 'PAY-003', date: '2024-06-20', project: 'Visionary OS', amount: 12000, status: 'Paid' },
    { id: 'PAY-004', date: '2024-06-05', project: 'Helios Platform', amount: 4500, status: 'Paid' },
];

export default function ProfessionalEarningsPage() {
    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-0 sm:pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Earnings</h2>
                    <p className="text-muted-foreground">Track your payouts and manage payment methods.</p>
                </div>
                 <Button>
                    <Download className="mr-2 h-4 w-4" /> Download Statement
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available for Withdrawal</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹5,000</div>
                        <p className="text-xs text-muted-foreground">Ready for instant payout.</p>
                         <Button size="sm" className="mt-4 w-full"><Landmark className="mr-2 h-4 w-4" /> Withdraw Funds</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹7,500</div>
                        <p className="text-xs text-muted-foreground">From 1 ongoing project.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹4,52,310</div>
                        <p className="text-xs text-muted-foreground">Total amount paid out.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payout History</CardTitle>
                    <CardDescription>A record of all your completed payments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payout ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {earningsHistory.map((payout) => (
                                <TableRow key={payout.id}>
                                    <TableCell className="font-medium">{payout.id}</TableCell>
                                    <TableCell>{payout.date}</TableCell>
                                    <TableCell>{payout.project}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className="bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                            variant="secondary"
                                        >
                                            {payout.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">₹{payout.amount.toLocaleString('en-IN')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
