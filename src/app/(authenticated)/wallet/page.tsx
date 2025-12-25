
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, DollarSign, FileClock, Package, Star } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { motion } from "framer-motion";
import { AppPagination } from '@/components/app-pagination';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: 'easeOut', duration: 0.4 } },
};

const transactionHistory = [
    { id: 'TXN-001', date: '2024-08-22', type: 'Package Purchase', description: 'Bought Accelerator Package', amount: '₹1,799', change: '+5 Packages', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-002', date: '2024-08-20', type: 'Points Earned', description: 'Completed test for "QuantumLeap CRM"', amount: '+150 Points', change: '+150 Points', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-003', date: '2024-08-18', type: 'Package Used', description: 'Submitted "Project Phoenix"', amount: '-1 Package', change: '-1 Package', status: 'Completed', changeType: 'negative' },
    { id: 'TXN-004', date: '2024-08-15', type: 'Points Spent', description: 'Submitted "Starlight Editor" to community', amount: '-1200 Points', change: '-1200 Points', status: 'Completed', changeType: 'negative' },
    { id: 'TXN-005', date: '2024-08-12', type: 'Points Earned', description: 'Completed test for "Helios Platform"', amount: '+100 Points', change: '+100 Points', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-006', date: '2024-08-10', type: 'Package Purchase', description: 'Bought Booster Package', amount: '₹699', change: '+1 Package', status: 'Completed', changeType: 'positive' },
    { id: 'TXN-007', date: '2024-08-05', type: 'Points Earned', description: 'High-quality bug report on "Nexus Browser"', amount: '+50 Points', change: '+50 Points', status: 'Completed', changeType: 'positive' },
];

const ITEMS_PER_PAGE = 5;

const TransactionTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'Package Purchase': return <Package className="w-4 h-4 text-blue-500" />;
        case 'Package Used': return <FileClock className="w-4 h-4 text-orange-500" />;
        case 'Points Earned': return <Star className="w-4 h-4 text-green-500" />;
        case 'Points Spent': return <FileClock className="w-4 h-4 text-red-500" />;
        default: return <DollarSign className="w-4 h-4 text-muted-foreground" />;
    }
};

export default function WalletPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(transactionHistory.length / ITEMS_PER_PAGE);
    const paginatedHistory = transactionHistory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.div variants={itemVariants}>
                        <BackButton href="/dashboard" />
                        <div className="text-center max-w-3xl mx-auto mt-8">
                            <h1 className="text-4xl md:text-5xl font-bold">My Wallet</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A central place to track your packages, points, and all transaction history.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div variants={containerVariants} className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-8">
                           <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl shadow-2xl shadow-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-white/80 text-sm font-medium">Available Packages</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-7xl font-bold text-white">3</p>
                                    <p className="text-white/80">for Professional Path submissions</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white" asChild>
                                        <Link href="/billing">Purchase More</Link>
                                    </Button>
                                </CardFooter>
                           </Card>
                            <Card className="bg-secondary/50 rounded-3xl">
                                <CardHeader>
                                    <CardTitle className="text-muted-foreground text-sm font-medium">Community Points</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-7xl font-bold">1,250</p>
                                    <p className="text-muted-foreground">earned from community testing</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" asChild>
                                        <Link href="/community-dashboard">Earn More Points</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants} className="lg:col-span-2">
                             <Card className="h-full rounded-3xl">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your latest wallet activities.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {transactionHistory.slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex items-center">
                                            <div className="p-3 bg-secondary rounded-full mr-4">
                                                {item.changeType === 'positive' ? <ArrowUp className="w-5 h-5 text-green-500" /> : <ArrowDown className="w-5 h-5 text-red-500" />}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm">{item.description}</p>
                                                <p className="text-xs text-muted-foreground">{item.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold text-sm ${item.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {item.change}
                                                </p>
                                            </div>
                                        </div>
                                     ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                     <motion.div variants={itemVariants} className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
                        <Card className="rounded-2xl">
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="hidden sm:table-cell">Description</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedHistory.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <TransactionTypeIcon type={item.type} />
                                                        <span className="hidden md:inline">{item.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">{item.description}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>
                                                     <span className={`font-medium ${item.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{item.amount}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={item.status === 'Completed' ? 'secondary' : 'outline'}>{item.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
