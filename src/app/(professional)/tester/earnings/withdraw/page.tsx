
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Banknote, Landmark, IndianRupee } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackButton } from "@/components/back-button";

export default function WithdrawFundsPage() {
    return (
        <div className="flex-1 space-y-8 p-4 sm:p-8 pt-6">
             <div className="flex items-center gap-4">
                <BackButton href="/tester/earnings" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Withdraw Funds</h2>
                    <p className="text-muted-foreground">Transfer your available earnings to your account.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card>
                         <Tabs defaultValue="bank" className="w-full">
                            <CardHeader>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="bank"><Landmark className="mr-2 h-4 w-4"/> Bank Transfer</TabsTrigger>
                                    <TabsTrigger value="upi"><IndianRupee className="mr-2 h-4 w-4"/> UPI</TabsTrigger>
                                </TabsList>
                            </CardHeader>
                            <CardContent>
                                <TabsContent value="bank">
                                    <form className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="account-holder">Account Holder Name</Label>
                                            <Input id="account-holder" placeholder="Enter name as per bank records" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="account-number">Account Number</Label>
                                            <Input id="account-number" placeholder="Enter your bank account number" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="ifsc">IFSC Code</Label>
                                            <Input id="ifsc" placeholder="Enter your bank's IFSC code" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amount-bank">Amount (INR)</Label>
                                            <Input id="amount-bank" type="number" placeholder="Max. ₹5,000" />
                                        </div>
                                        <Button type="submit" className="w-full">Initiate Bank Transfer</Button>
                                    </form>
                                </TabsContent>
                                 <TabsContent value="upi">
                                     <form className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="upi-id">UPI ID</Label>
                                            <Input id="upi-id" placeholder="yourname@bank" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="upi-name">Beneficiary Name</Label>
                                            <Input id="upi-name" placeholder="Enter name for verification" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amount-upi">Amount (INR)</Label>
                                            <Input id="amount-upi" type="number" placeholder="Max. ₹5,000" />
                                        </div>
                                        <Button type="submit" className="w-full">Transfer via UPI</Button>
                                    </form>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>
                 <div className="space-y-8">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                            <Banknote className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">₹5,000</div>
                            <p className="text-xs text-muted-foreground">Ready for instant payout.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payout Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-3">
                            <p>Payouts are processed within 24-48 hours of request.</p>
                            <p>A standard processing fee of 2.5% may be applied to each withdrawal.</p>
                            <p>Ensure your details are correct to avoid delays. inTesters is not responsible for transfers to incorrect accounts.</p>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>
    )
}
