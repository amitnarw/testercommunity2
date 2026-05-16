"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { useInvoice } from "@/hooks/useBilling";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import Image from "next/image";
import { ROUTES } from "@/lib/routes";

export default function AdminInvoicePage() {
  const params = useParams();
  const invoiceNumber = params.invoiceNumber as string;
  const { data: invoice, isPending, isError } = useInvoice(invoiceNumber);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <Skeleton className="h-10 w-40 mb-10" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The invoice you are looking for does not exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href={`${ROUTES.ADMIN.FINANCE}?tab=invoices`}>Go to Finance</Link>
        </Button>
      </div>
    );
  }

  const { payment, user } = invoice;
  const order = payment?.order;
  const billingInfo = user?.billingInfo;

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl print:p-0 print:max-w-none">
        {/* Actions bar - Hidden on print */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 print:hidden">
          <BackButton href={`${ROUTES.ADMIN.FINANCE}?tab=invoices`} />

          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Card */}
        <div
          ref={printRef}
          className="bg-white text-slate-900 rounded-3xl shadow-xl overflow-hidden print:shadow-none print:rounded-none print:bg-white print-card"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row justify-between gap-8 print-flex">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 overflow-hidden">
                  <Image
                    src="/apple-icon.png"
                    alt="InTesters Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold tracking-tighter">InTesters</h1>
              </div>
              <p className="text-slate-400 text-sm max-w-[200px]">
                Professional Android App Testing Community.
              </p>
            </div>

            <div className="text-right flex flex-col justify-end">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-primary/80 mb-1">Invoice</h2>
              <p className="text-slate-400 font-medium">#{invoice.invoice_number}</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-12">
            {/* Meta Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-100 pb-12 print-grid">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bill To</h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{billingInfo?.name || user?.name || "Customer"}</p>
                  <p className="text-slate-600 text-sm">{billingInfo?.email || user?.email}</p>
                  {billingInfo?.address && <p className="text-slate-600 text-sm">{billingInfo.address}</p>}
                  {billingInfo?.city && (
                    <p className="text-slate-600 text-sm">
                      {billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}
                    </p>
                  )}
                  {billingInfo?.country && <p className="text-slate-600 text-sm">{billingInfo.country}</p>}
                </div>
              </div>

              <div className="md:text-right space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date Issued</h3>
                    <p className="font-bold">{format(new Date(invoice.createdAt), "MMMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</h3>
                    <p className="font-bold capitalize">{payment?.method || "Razorpay"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction ID</h3>
                    <p className="font-mono text-xs text-slate-500">{payment?.razorpayPaymentId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-4 font-bold text-slate-900">Description</th>
                      <th className="py-4 font-bold text-slate-900 text-center">Qty</th>
                      <th className="py-4 font-bold text-slate-900 text-right">Unit Price</th>
                      <th className="py-4 font-bold text-slate-900 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-6">
                        <p className="font-bold text-slate-900">{invoice.service_name}</p>
                        <p className="text-slate-500 text-sm">Professional Android Testing Package</p>
                      </td>
                      <td className="py-6 text-center font-medium">1</td>
                      <td className="py-6 text-right font-medium">
                        {payment?.currency} {(payment?.amount / 100).toLocaleString()}
                      </td>
                      <td className="py-6 text-right font-bold">
                        {payment?.currency} {(payment?.amount / 100).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-8">
              <div className="w-full sm:w-64 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{payment?.currency} {(payment?.amount / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (0%)</span>
                  <span className="font-medium">0.00</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-slate-900 border-t-2 border-slate-900 pt-3">
                  <span>Total</span>
                  <span>{payment?.currency} {(payment?.amount / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-20 text-center border-t border-slate-100">
              <p className="text-slate-400 text-xs italic">
                Thank you for choosing InTesters for your app testing needs. This is a computer generated invoice.
              </p>
              <div className="mt-4 flex justify-center gap-6 text-slate-300">
                <p className="text-[10px] font-bold tracking-widest uppercase">www.intesters.com</p>
                <p className="text-[10px] font-bold tracking-widest uppercase">support@intesters.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          html, body {
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide layout elements during print */
          nav, header, footer, aside, 
          [data-loc="Sidebar"], 
          [data-loc="Navbar"], 
          [data-loc="Footer"],
          [data-loc="BaseSidebar"],
          .print\\:hidden {
            display: none !important;
          }
          /* Reset container and main */
          .container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          main, .md\\:pl-20 {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          /* Invoice specific print styles */
          .bg-white {
            background-color: white !important;
          }
          .bg-slate-900 {
            background-color: #0f172a !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
          }
          .print-card {
            break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            border: 1px solid #e2e8f0 !important;
          }
          .print-card > div {
            padding: 2rem !important;
          }
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          .print-flex {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-end !important;
          }
          .text-slate-400 {
            color: #94a3b8 !important;
          }
          .text-primary\\/80 {
            color: #3b82f6 !important;
          }
          .shadow-xl {
            box-shadow: none !important;
          }
          .rounded-3xl {
            border-radius: 0 !important;
          }
          .min-h-screen {
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
          .pb-20 {
            padding-bottom: 0 !important;
          }
          .overflow-x-auto {
            overflow: visible !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
