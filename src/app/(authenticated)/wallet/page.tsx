
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, DollarSign, FileClock, Package, Star, IndianRupee } from "lucide-react";
import { BackButton } from "@/components/back-button";
import { motion } from "framer-motion";
import { AppPagination } from '@/components/app-pagination';
import Link from 'next/link';
import { transactionHistory } from '@/lib/data';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { ease: 'easeOut', duration: 0.4 } },
};


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
        <div className="container mx-auto px-4 md:px-6 mb-8">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                <motion.div variants={itemVariants}>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent pb-1">My Wallet</h1>
                        <p className="text-muted-foreground">
                            A central place to track your packages, points, and all transaction history.
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl shadow-2xl shadow-primary/20 h-full">
                            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-6 sm:py-3">
                                <CardTitle className="text-white/80 text-sm font-medium">Available Packages</CardTitle>
                                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm !h-auto p-2 sm:px-4" asChild>
                                    <Link href="/billing">Purchase More</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl sm:text-4xl font-bold text-white">3</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-card rounded-3xl h-full">
                            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-6 sm:py-3">
                                <CardTitle className="text-muted-foreground text-sm font-medium">Community Points</CardTitle>
                                <Button variant="outline" asChild className='text-xs sm:text-sm !h-auto p-2 sm:px-4'>
                                    <Link href="/community-dashboard">Earn More Points</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl sm:text-4xl font-bold">1,250</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <motion.div variants={containerVariants} className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div variants={itemVariants}>
                        <Card className="h-full rounded-3xl bg-card">
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

                    <motion.div variants={itemVariants}>
                        <Card className="rounded-2xl h-full">
                            <CardHeader>
                                <CardTitle>Transaction History</CardTitle>
                                <CardDescription>A record of all your wallet transactions.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead className="hidden sm:table-cell">Description</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter>
                                <AppPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            </CardFooter>
                        </Card>
                    </motion.div>
                </motion.div>

            </motion.div>
        </div>
    );
}
