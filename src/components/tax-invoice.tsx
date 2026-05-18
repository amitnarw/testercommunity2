"use client";

import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { InvoiceDetail } from "@/lib/types";

const COMPANY = {
  name: "Gamdix Private Limited",
  brandName: "InTesters",
  addressLine1: "C/o Spring House Co-working Pvt Ltd",
  addressLine2: "B 1/639 A Janakpuri, Janakpuri B-1",
  city: "New Delhi",
  state: "Delhi",
  pincode: "110058",
  country: "India",
  gstin: "07AAKCG5039N1Z4",
  pan: "AAKCG5039N",
  sacCode: "998313",
  email: "contact@gamdix.in",
  website: "www.intesters.com",
  stateCode: "07",
  stateName: "Delhi",
};

const PRIMARY = "#3b82f6";

function formatCurrency(amount: number, currency: string): string {
  const value = amount / 100;
  const symbol = currency === "INR" ? "\u20B9" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatAmountInWords(words: string | null, amount: number, currency: string): string {
  if (words) return words;
  const value = amount / 100;
  const cur = currency === "INR" ? "Rupees" : "US Dollars";
  if (value === 0) return `${cur} Zero Only`;
  return `${cur} ${Math.round(value).toLocaleString("en-IN")} Only`;
}

interface TaxInvoiceProps {
  invoice: InvoiceDetail;
  isAdmin?: boolean;
}

export function TaxInvoice({ invoice }: TaxInvoiceProps) {
  const { payment, user } = invoice;
  const billingInfo = user?.billingInfo;
  const userDetail = user?.userDetail;
  const order = payment?.order;
  const isExport = invoice.invoice_type === "EXP";
  const isIndia = billingInfo?.country === "India" || !billingInfo?.country;
  const isDelhi = (billingInfo?.state || "").toLowerCase() === "delhi" || invoice.place_of_supply === "Delhi";
  const isNewFormat = invoice.invoice_number.startsWith("GXIT");

  const currency = payment?.currency || "INR";
  const subtotal = payment?.amount || 0;
  const cgstAmount = invoice.cgst_amount || 0;
  const sgstAmount = invoice.sgst_amount || 0;
  const igstAmount = invoice.igst_amount || 0;
  const totalAmount = subtotal + cgstAmount + sgstAmount + igstAmount;
  const quantity = invoice.quantity || (order?.packageCount || 1);
  const unitPrice = invoice.unit_price || Math.round(subtotal / quantity);

  if (!isNewFormat) {
    return <LegacyInvoice invoice={invoice} />;
  }

  const invoiceDate = invoice.createdAt ? format(new Date(invoice.createdAt), "dd MMM yyyy") : "\u2014";
  const dueDate = invoice.due_date ? format(new Date(invoice.due_date), "dd MMM yyyy") : "\u2014";

  return (
    <div className="bg-white text-gray-900 text-[11px] leading-[1.4] print-card">
      {/** ---- HEADER ---- */}
      <div style={{ backgroundColor: PRIMARY }} className="px-6 py-4 flex items-center justify-between print-header-solid">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
            <Image src="/inTesters-logo.svg" alt="InTesters" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold leading-none">{COMPANY.brandName}</h1>
            <p className="text-white/70 text-[10px]">Professional App Testing Community</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-white text-xl font-extrabold uppercase tracking-tight leading-none">Tax Invoice</h2>
          {isExport && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
              Export of Services
            </span>
          )}
        </div>
      </div>

      {/** ---- BODY ---- */}
      <div className="px-6 pt-4 pb-2">
        {/** ---- SELLER + INVOICE META ---- */}
        <div className="grid grid-cols-2 gap-0 border border-gray-300 border-b-0 print-grid-2col">
          <div className="p-3 border-r border-b border-gray-300">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Sold By</p>
            <p className="font-bold text-gray-900 text-[12px]">{COMPANY.name}</p>
            <p className="text-gray-600">{COMPANY.addressLine1}</p>
            <p className="text-gray-600">{COMPANY.addressLine2}</p>
            <p className="text-gray-600">{COMPANY.city}, {COMPANY.state} &mdash; {COMPANY.pincode}</p>
            <p className="text-gray-600 mb-1.5">{COMPANY.country}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-700">
              <span className="text-gray-400">GSTIN</span><span className="font-mono font-semibold">{COMPANY.gstin}</span>
              <span className="text-gray-400">PAN</span><span className="font-mono font-semibold">{COMPANY.pan}</span>
              <span className="text-gray-400">Email</span><span>{COMPANY.email}</span>
            </div>
          </div>
          <div className="p-3 border-b border-gray-300">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Invoice Details</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-gray-700">
              <span className="text-gray-400">Invoice No.</span><span className="font-mono font-semibold text-gray-900">{invoice.invoice_number}</span>
              <span className="text-gray-400">Date</span><span className="font-semibold text-gray-900">{invoiceDate}</span>
              <span className="text-gray-400">Due Date</span><span>{dueDate}</span>
              <span className="text-gray-400">Supply Type</span><span className="font-semibold">{invoice.supply_type || (isExport ? "Export of Services" : "Supply of Services")}</span>
              <span className="text-gray-400">Place of Supply</span><span>{invoice.place_of_supply || "\u2014"}</span>
              <span className="text-gray-400">Currency</span><span className="font-semibold">{currency}</span>
              {isExport && invoice.lut_number && (<><span className="text-gray-400">LUT No.</span><span className="font-mono">{invoice.lut_number}</span></>)}
            </div>
          </div>
        </div>

        {/** ---- BUYER + NATURE ---- */}
        <div className="grid grid-cols-2 gap-0 border border-gray-300 border-b-0 border-t-0 print-grid-2col">
          <div className="p-3 border-r border-b border-gray-300">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Bill To</p>
            <p className="font-bold text-gray-900 text-[12px]">{billingInfo?.name || user?.name || "Customer"}</p>
            {userDetail?.company_name && <p className="font-semibold text-gray-700">{userDetail.company_name}</p>}
            <div className="text-gray-600">
              {billingInfo?.address && <p>{billingInfo.address}</p>}
              {(billingInfo?.city || billingInfo?.state || billingInfo?.zipCode) && (
                <p>{[billingInfo?.city, billingInfo?.state, billingInfo?.zipCode].filter(Boolean).join(", ")}</p>
              )}
              {billingInfo?.country && <p>{billingInfo.country}</p>}
              {billingInfo?.gstin && <p className="mt-1"><span className="text-gray-400">GSTIN:</span> <span className="font-mono">{billingInfo.gstin}</span></p>}
              <p><span className="text-gray-400">Email:</span> {billingInfo?.email || user?.email}</p>
            </div>
          </div>
          <div className="p-3 border-b border-gray-300">
            {isExport ? (
              <>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nature of Export</p>
                <p className="text-gray-700">Zero-Rated Supply (Export under LUT without payment of Integrated Tax)</p>
              </>
            ) : (
              <>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nature of Supply</p>
                <p className="text-gray-700">Supply of Services</p>
                {billingInfo?.gstin && (
                  <p className="mt-1 text-gray-600"><span className="text-gray-400">Buyer GSTIN:</span> <span className="font-mono">{billingInfo.gstin}</span></p>
                )}
              </>
            )}
          </div>
        </div>

        {/** ---- ITEMS TABLE ---- */}
        <table className="w-full border border-gray-300 border-t-0">
          <thead>
            <tr style={{ backgroundColor: PRIMARY }} className="text-white text-[10px]">
              <th className="py-2 px-3 text-left font-semibold w-6">#</th>
              <th className="py-2 px-3 text-left font-semibold">Description of Service</th>
              <th className="py-2 px-3 text-center font-semibold">SAC</th>
              <th className="py-2 px-3 text-center font-semibold">Period</th>
              <th className="py-2 px-3 text-center font-semibold">Qty</th>
              <th className="py-2 px-3 text-right font-semibold">Rate</th>
              <th className="py-2 px-3 text-right font-semibold">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2.5 px-3 text-gray-500 text-center">1</td>
              <td className="py-2.5 px-3">
                <p className="font-semibold text-gray-900">{invoice.service_name}</p>
                <p className="text-gray-500">App Testing Services</p>
              </td>
              <td className="py-2.5 px-3 text-center font-mono text-gray-600">{invoice.sac_code || COMPANY.sacCode}</td>
              <td className="py-2.5 px-3 text-center text-gray-600">{invoice.period || "\u2014"}</td>
              <td className="py-2.5 px-3 text-center font-medium text-gray-900">{quantity}</td>
              <td className="py-2.5 px-3 text-right font-medium text-gray-900">{formatCurrency(unitPrice, currency)}</td>
              <td className="py-2.5 px-3 text-right font-bold text-gray-900">{formatCurrency(subtotal, currency)}</td>
            </tr>
          </tbody>
        </table>

        {/** ---- TOTALS ---- */}
        <div className="border-x border-b border-gray-300">
          <div className="grid grid-cols-[1fr_180px]">
            <div className="p-3 border-r border-gray-300">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount in Words</p>
              <p className="text-[12px] font-semibold text-gray-800 italic">
                {formatAmountInWords(invoice.amount_in_words, totalAmount, currency)}
              </p>
            </div>
            <div className="text-[11px]">
              <div className="flex justify-between px-3 py-1.5 border-b border-gray-200">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
              </div>
              {isIndia && isDelhi && !isExport ? (
                <>
                  <div className="flex justify-between px-3 py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">CGST @ 9%</span>
                    <span className="font-medium">{formatCurrency(cgstAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">SGST @ 9%</span>
                    <span className="font-medium">{formatCurrency(sgstAmount, currency)}</span>
                  </div>
                </>
              ) : isIndia && !isExport ? (
                <div className="flex justify-between px-3 py-1.5 border-b border-gray-200">
                  <span className="text-gray-500">IGST @ 18%</span>
                  <span className="font-medium">{formatCurrency(igstAmount, currency)}</span>
                </div>
              ) : (
                <div className="flex justify-between px-3 py-1.5 border-b border-gray-200">
                  <span className="text-gray-500">IGST @ 0% (Zero-rated)</span>
                  <span className="font-medium">{formatCurrency(0, currency)}</span>
                </div>
              )}
              <div className="flex justify-between px-3 py-2 font-bold text-gray-900" style={{ backgroundColor: "#eff6ff" }}>
                <span>Total</span>
                <span className="text-[13px]">{formatCurrency(totalAmount, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/** ---- DECLARATION + SIGNATORY ---- */}
        <div className="grid grid-cols-2 gap-0 border border-gray-300 border-t-0 mt-0 print-grid-2col">
          <div className="p-3 border-r border-gray-300">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Declaration</p>
            <p className="text-gray-500">This is a computer-generated tax invoice.</p>
            {isExport && <p className="text-gray-500">Supply meant for Export under LUT without payment of Integrated Tax.</p>}
            <p className="text-gray-500">E&amp;OE; Subject to {COMPANY.stateName} jurisdiction.</p>
          </div>
          <div className="p-3 text-right">
            <p className="text-gray-400 text-[10px] mb-10">For {COMPANY.name}</p>
            <div className="border-t border-gray-300 pt-1 inline-block min-w-[140px]">
              <p className="text-gray-500 text-[10px]">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/** ---- FOOTER BAR ---- */}
        <div className="py-2.5 text-center" style={{ backgroundColor: PRIMARY }}>
          <p className="text-white/80 text-[9px] font-semibold tracking-wider uppercase">
            {COMPANY.website} &nbsp;&middot;&nbsp; {COMPANY.email}
          </p>
        </div>
      </div>
    </div>
  );
}

function LegacyInvoice({ invoice }: { invoice: InvoiceDetail }) {
  const { payment, user } = invoice;
  const billingInfo = user?.billingInfo;
  const currency = payment?.currency || "INR";

  return (
    <div className="bg-white text-slate-900 rounded-3xl shadow-xl overflow-hidden print:shadow-none print:rounded-none print:bg-white print-card">
      <div className="bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row justify-between gap-8 print-flex">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 overflow-hidden">
              <Image src="/apple-icon.png" alt="InTesters Logo" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter">InTesters</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-[200px]">Professional Android App Testing Community.</p>
        </div>
        <div className="text-right flex flex-col justify-end">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-primary/80 mb-1">Invoice</h2>
          <p className="text-slate-400 font-medium">#{invoice.invoice_number}</p>
        </div>
      </div>
      <div className="p-8 sm:p-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-100 pb-12 print-grid">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bill To</h3>
            <div className="space-y-1">
              <p className="font-bold text-lg">{billingInfo?.name || user?.name || "Customer"}</p>
              <p className="text-slate-600 text-sm">{billingInfo?.email || user?.email}</p>
              {billingInfo?.address && <p className="text-slate-600 text-sm">{billingInfo.address}</p>}
              {billingInfo?.city && (
                <p className="text-slate-600 text-sm">{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
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
                  <td className="py-6 text-right font-medium">{currency} {((payment?.amount || 0) / 100).toLocaleString()}</td>
                  <td className="py-6 text-right font-bold">{currency} {((payment?.amount || 0) / 100).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end pt-8">
          <div className="w-full sm:w-64 space-y-3">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-medium">{currency} {((payment?.amount || 0) / 100).toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-600"><span>Tax (0%)</span><span className="font-medium">0.00</span></div>
            <div className="flex justify-between text-2xl font-black text-slate-900 border-t-2 border-slate-900 pt-3"><span>Total</span><span>{currency} {((payment?.amount || 0) / 100).toLocaleString()}</span></div>
          </div>
        </div>
        <div className="pt-20 text-center border-t border-slate-100">
          <p className="text-slate-400 text-xs italic">Thank you for choosing InTesters for your app testing needs. This is a computer generated invoice.</p>
          <div className="mt-4 flex justify-center gap-6 text-slate-300">
            <p className="text-[10px] font-bold tracking-widest uppercase">www.intesters.com</p>
            <p className="text-[10px] font-bold tracking-widest uppercase">support@intesters.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}