"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useInvoice } from "@/hooks/useBilling";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { TaxInvoice } from "@/components/tax-invoice";

export default function InvoicePage() {
  const params = useParams();
  const invoiceNumber = params.invoiceNumber as string;
  const { data: invoice, isPending, isError } = useInvoice(invoiceNumber);

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
          The invoice you are looking for does not exist or you don&apos;t have permission to view it.
        </p>
        <Button asChild>
          <Link href="/wallet">Go to Wallet</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-[820px] print:p-0 print:max-w-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 print:hidden">
          <BackButton href="/wallet" />
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

        <TaxInvoice invoice={invoice} />
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          html, body {
            height: auto;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, header, footer, aside,
          [data-loc="Sidebar"],
          [data-loc="Navbar"],
          [data-loc="Footer"],
          [data-loc="BaseSidebar"],
          .print\\:hidden {
            display: none !important;
          }
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
          .print-card {
            break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            position: relative !important;
          }
          .print-paid-stamp {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-paid-stamp div {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-header-solid {
            background-color: #3b82f6 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-grid-2col {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
          }
          .print-flex {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-end !important;
          }
          .min-h-screen {
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
          .pb-20 {
            padding-bottom: 0 !important;
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