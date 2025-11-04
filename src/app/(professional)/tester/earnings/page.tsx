
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, CreditCard, Banknote, IndianRupee, Landmark } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppPagination } from "@/components/app-pagination";


const earningsHistory = [
    { id: 'PAY-001', date: '2024-08-01', project: 'Nexus Browser', amount: 6000, status: 'Paid' },
    { id: 'PAY-002', date: '2024-07-15', project: 'Odyssey Social', amount: 8000, status: 'Paid' },
    { id: 'PAY-003', date: '2024-06-20', project: 'Visionary OS', amount: 12000, status: 'Paid' },
    { id: 'PAY-004', date: '2024-06-05', project: 'Helios Platform', amount: 4500, status: 'Paid' },
    { id: 'PAY-005', date: '2024-05-18', project: 'QuantumLeap CRM', amount: 7200, status: 'Paid' },
    { id: 'PAY-006', date: '2024-05-02', project: 'Project Chimera', amount: 9500, status: 'Paid' },
    { id: 'PAY-007', date: '2024-04-15', project: 'Starlight Editor', amount: 5500, status: 'Paid' },
    { id: 'PAY-008', date: '2024-04-01', project: 'Aperture Notes', amount: 6800, status: 'Paid' },
    { id: 'PAY-009', date: '2024-03-20', project: 'Black Mesa OS', amount: 11000, status: 'Paid' },
    { id: 'PAY-010', date: '2024-03-05', project: 'Blue Sun CRM', amount: 8500, status: 'Paid' },
    { id: 'PAY-011', date: '2024-02-18', project: 'Weyland-Yutani Suite', amount: 15000, status: 'Paid' },
    { id: 'PAY-012', date: '2024-02-01', project: 'Virtucon Scheduler', amount: 4000, status: 'Paid' },
];

const PAYOUTS_PER_PAGE = 5;

export default function ProfessionalEarningsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(earningsHistory.length / PAYOUTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PAYOUTS_PER_PAGE;
    const endIndex = startIndex + PAYOUTS_PER_PAGE;
    const currentPayouts = earningsHistory.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">Earnings</h2>
                    <p className="text-sm sm:text-md text-muted-foreground">Track your payouts and manage payment methods.</p>
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
                        <Button size="sm" className="mt-4 w-full" asChild>
                            <Link href="/tester/earnings/withdraw">
                                <Landmark className="mr-2 h-4 w-4" /> Withdraw Funds
                            </Link>
                        </Button>
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

            <div>
                <CardHeader className="p-2 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl">Payout History</CardTitle>
                    <CardDescription className="text-sm sm:text-md">A record of all your completed payments.</CardDescription>
                </CardHeader>
                <Card>
                    <CardContent className="grid grid-cols-1 p-2 sm:p-6">
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
                                {currentPayouts.map((payout) => (
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
                        <AppPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
