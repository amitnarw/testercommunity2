"use client";

import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { InvoiceDetail } from "@/lib/types";
import { INDIAN_STATES } from "@/lib/indian-states";

const COMPANY = {
  name: "Gamdix Private Limited",
  brandName: "inTesters",
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
const PRIMARY_LIGHT = "#eff6ff";
const PRIMARY_DARK = "#1e40af";

function formatCurrency(amount: number, currency: string): string {
  const value = amount / 100;
  const symbol = currency === "INR" ? "\u20B9" : currency === "USD" ? "$" : `${currency} `;
  return `${symbol}${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatAmountInWords(words: string | null, amount: number, currency: string): string {
  if (words) return words;
  const mainAmount = Math.floor(amount / 100);
  const fractionalAmount = Math.abs(amount % 100);
  const prefix = currency === "INR" ? "Rupees" : "US Dollars";
  const fracName = currency === "INR" ? "Paise" : "Cents";
  if (mainAmount === 0 && fractionalAmount === 0) return `${prefix} Zero Only`;
  const parts: string[] = [];
  if (mainAmount > 0) parts.push(`${prefix} ${mainAmount.toLocaleString("en-IN")}`);
  if (fractionalAmount > 0) parts.push(`${fracName} ${fractionalAmount}`);
  return parts.join(" and ") + " Only";
}

interface TaxInvoiceProps {
  invoice: InvoiceDetail;
  isAdmin?: boolean;
}

function getStateDisplay(stateName: string | null | undefined, stateCode: string | null | undefined): string | null {
  if (!stateName && !stateCode) return null;
  const code = stateCode || "";
  const entry = stateName ? INDIAN_STATES.find((s) => s.name.toLowerCase() === stateName.toLowerCase()) : null;
  if (entry) {
    return `${entry.name} (${entry.alphaCode} / ${entry.numericCode})`;
  }
  if (code && stateName) {
    return `${stateName} (${code})`;
  }
  return stateName || `State Code: ${code}` || null;
}

export function TaxInvoice({ invoice }: TaxInvoiceProps) {
  const { payment, user } = invoice;
  const billingInfo = user?.billingInfo;
  const userDetail = user?.userDetail;
  const order = payment?.order;
  const isExport = invoice.invoice_type === "EXP";
  const isIndia = billingInfo?.country === "India" || !billingInfo?.country;
  const isDelhi = (billingInfo?.state || "").toLowerCase() === "delhi" || invoice.place_of_supply === "Delhi";

  const currency = payment?.currency || "INR";
  const quantity = invoice.quantity || (order?.packageCount || 1);
  const unitPrice = invoice.unit_price || Math.round((payment?.amount || 0) / quantity);
  const subtotal = unitPrice * quantity;
  const cgstAmount = invoice.cgst_amount || 0;
  const sgstAmount = invoice.sgst_amount || 0;
  const igstAmount = invoice.igst_amount || 0;
  const totalAmount = subtotal + cgstAmount + sgstAmount + igstAmount;

  const invoiceDate = invoice.createdAt ? format(new Date(invoice.createdAt), "dd MMM yyyy") : "\u2014";

  return (
    <div className="bg-white text-slate-800 print-card relative overflow-hidden print:overflow-visible print:page-break-inside-avoid print:flex print:flex-col print:min-h-[297mm]" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/** CONTENT */}
      <div className="relative print:flex print:flex-col print:flex-1">
        {/** TOP ACCENT LINE */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})` }} />

        {/** HEADER */}
        <div className="px-10 max-[639px]:px-4 pt-5 pb-4">
          <div className="flex items-start justify-between max-[639px]:flex-col max-[639px]:gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center p-1.5 shrink-0" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})` }}>
                <Image src="/inTesters-logo-light.svg" alt="inTesters" width={30} height={30} className="object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{COMPANY.brandName}</h1>
                <p className="text-slate-400 text-xs font-medium mt-0.5">Professional App Testing Platform</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex flex-col items-end">
                <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: PRIMARY }}>Tax Invoice</h2>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap justify-end">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No.</span>
                  <span className="font-mono text-sm font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">{invoice.invoice_number}</span>
                  <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-widest text-white bg-emerald-500">
                    Paid
                  </span>
                  {isExport && (
                    <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: PRIMARY }}>
                      Export
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 max-[639px]:mx-4 h-px bg-slate-100" />

        {/** SELLER + INVOICE DETAILS */}
        <div className="px-10 max-[639px]:px-4 py-3">
          <div className="grid grid-cols-2 max-[639px]:grid-cols-1 print-grid-2col gap-6 max-[639px]:gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: PRIMARY }}>Sold By</p>
              <p className="text-[13px] font-bold text-slate-900 leading-snug">{COMPANY.name}</p>
              <div className="mt-1.5 space-y-0.5 text-xs text-slate-500 leading-relaxed">
                <p>{COMPANY.addressLine1}</p>
                <p>{COMPANY.addressLine2}</p>
                <p>{COMPANY.city}, {COMPANY.state} &mdash; {COMPANY.pincode}</p>
                <p>{COMPANY.country}</p>
              </div>
              <div className="mt-2 space-y-0.5 text-xs">
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">GSTIN</span>
                  <span className="font-mono font-semibold text-slate-700">{COMPANY.gstin}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">PAN</span>
                  <span className="font-mono font-semibold text-slate-700">{COMPANY.pan}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">State</span>
                  <span className="font-mono font-semibold text-slate-700">{COMPANY.stateName} ({COMPANY.stateCode})</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">Email</span>
                  <span className="text-slate-600">{COMPANY.email}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: PRIMARY }}>Invoice Details</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Invoice No.</span>
                  <span className="font-mono font-semibold text-slate-800">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Date</span>
                  <span className="font-semibold text-slate-800">{invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Supply</span>
                  <span className="text-slate-700">{invoice.supply_type || (isExport ? "Export of Services" : "Supply of Services")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Place of Supply</span>
                  <span className="text-slate-700">{invoice.place_of_supply || "\u2014"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Currency</span>
                  <span className="font-semibold text-slate-800">{currency}</span>
                </div>
                {invoice.lut_number && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">LUT</span>
                    <span className="font-mono text-slate-700">{invoice.lut_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 max-[639px]:mx-4 h-px bg-slate-100" />

        {/** BUYER + NATURE */}
        <div className="px-10 max-[639px]:px-4 py-2">
          <div className="grid grid-cols-2 max-[639px]:grid-cols-1 print-grid-2col gap-6 max-[639px]:gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: PRIMARY }}>Bill To</p>
              <p className="text-[12px] font-bold text-slate-900 leading-snug">{billingInfo?.name || user?.name || "Customer"}</p>
              {userDetail?.company_name && <p className="text-xs font-semibold text-slate-600">{userDetail.company_name}</p>}
              <div className="mt-1 space-y-0 text-xs text-slate-500 leading-relaxed">
                {billingInfo?.address && <p>{billingInfo.address}</p>}
                {(billingInfo?.city || billingInfo?.state || billingInfo?.zipCode) && (
                  <p>{[billingInfo?.city, billingInfo?.state, billingInfo?.zipCode].filter(Boolean).join(", ")}</p>
                )}
                {billingInfo?.country && <p>{billingInfo.country}</p>}
                {isIndia && (billingInfo?.state || billingInfo?.stateCode || invoice.state_code) && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {getStateDisplay(billingInfo?.state, invoice.state_code || billingInfo?.stateCode)}
                  </p>
                )}
              </div>
              <div className="mt-1.5 space-y-0.5 text-xs">
                {billingInfo?.gstin && (
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-medium w-12 shrink-0">GSTIN</span>
                    <span className="font-mono font-semibold text-slate-700">{billingInfo.gstin}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-12 shrink-0">Email</span>
                  <span className="text-slate-600">{billingInfo?.email || user?.email}</span>
                </div>
                {billingInfo?.phone && (
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-medium w-12 shrink-0">Phone</span>
                    <span className="text-slate-600">{billingInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              {isExport ? (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: PRIMARY }}>Nature of Export</p>
                  <p className="text-[13px] font-semibold text-slate-800 leading-snug">Professional App Testing Services</p>
                  <p className="text-xs text-slate-500 mt-0.5">Zero-Rated Supply (Export under LUT without payment of Integrated Tax)</p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: PRIMARY }}>Nature of Supply</p>
                  <p className="text-[13px] font-semibold text-slate-800 leading-snug">Professional App Testing Services</p>
                  {billingInfo?.gstin && (
                    <div className="mt-1 flex gap-2 text-xs">
                      <span className="text-slate-400 font-medium shrink-0">Buyer GSTIN:</span>
                      <span className="font-mono font-semibold text-slate-700">{billingInfo.gstin}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 max-[639px]:mx-4 h-px bg-slate-100" />

        {/** ITEMS TABLE */}
        <div className="px-10 max-[639px]:px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: PRIMARY }}>Service Details</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2" style={{ borderColor: PRIMARY }}>
                <th className="pb-1.5 text-left font-semibold text-slate-500 w-8 text-[10px]">#</th>
                <th className="pb-1.5 text-left font-semibold text-slate-500 text-[10px]">Description</th>
                <th className="pb-1.5 text-center font-semibold text-slate-500 text-[10px]">SAC</th>
                <th className="pb-1.5 text-center font-semibold text-slate-500 text-[10px]">Qty</th>
                <th className="pb-1.5 text-right font-semibold text-slate-500 text-[10px]">Rate</th>
                <th className="pb-1.5 text-right font-semibold text-slate-500 text-[10px]">Amount ({currency})</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 text-slate-400 text-center">1</td>
                <td className="py-2">
                  <p className="font-semibold text-slate-900 text-xs">App Testing</p>
                  <p className="text-[10px] text-slate-400">Professional App Testing Services</p>
                </td>
                <td className="py-2 text-center font-mono text-slate-500 text-[10px]">{invoice.sac_code || COMPANY.sacCode}</td>
                <td className="py-2 text-center font-semibold text-slate-800">{quantity}</td>
                <td className="py-2 text-right font-medium text-slate-700">{formatCurrency(unitPrice, currency)}</td>
                <td className="py-2 text-right font-bold text-slate-900">{formatCurrency(subtotal, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/** TOTALS */}
        <div className="px-10 max-[639px]:px-4 py-3">
          <div className="grid grid-cols-2 max-[639px]:grid-cols-1 print-grid-2col gap-6 max-[639px]:gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: PRIMARY }}>Amount in Words</p>
              <p className="text-xs font-medium text-slate-600 italic">
                {formatAmountInWords(invoice.amount_in_words, totalAmount, currency)}
              </p>
            </div>
            <div className="space-y-0">
              <div className="flex justify-between py-1.5 text-xs border-b border-slate-100">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-semibold text-slate-700">{formatCurrency(subtotal, currency)}</span>
              </div>
              {isIndia && isDelhi && !isExport ? (
                <>
                  <div className="flex justify-between py-1.5 text-xs border-b border-slate-100">
                    <span className="text-slate-400">CGST @ 9%</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(cgstAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-xs border-b border-slate-100">
                    <span className="text-slate-400">SGST @ 9%</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(sgstAmount, currency)}</span>
                  </div>
                </>
              ) : isIndia && !isExport ? (
                <div className="flex justify-between py-1.5 text-xs border-b border-slate-100">
                  <span className="text-slate-400">IGST @ 18%</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(igstAmount, currency)}</span>
                </div>
              ) : (
                <div className="flex justify-between py-1.5 text-xs border-b border-slate-100">
                  <span className="text-slate-400">IGST @ 0% (Zero-rated)</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(0, currency)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-sm font-bold text-slate-900 rounded-lg px-3" style={{ backgroundColor: PRIMARY_LIGHT }}>
                <span>Total</span>
                <span>{formatCurrency(totalAmount, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/** DECLARATION + SIGNATORY */}
        <div className="px-10 max-[639px]:px-4 py-3 print:mt-auto">
          <div className="grid grid-cols-2 max-[639px]:grid-cols-1 print-grid-2col gap-6 max-[639px]:gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: PRIMARY }}>Declaration</p>
              <p className="text-[10px] text-slate-400 leading-relaxed">This is a computer-generated tax invoice. {isExport && "Supply meant for Export under LUT without payment of Integrated Tax. "}E&amp;OE; Subject to {COMPANY.stateName} jurisdiction.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-8">For {COMPANY.name}</p>
              <div className="border-t-2 border-slate-800 pt-2 inline-block min-w-[160px]">
                <p className="text-xs text-slate-500 font-medium">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </div>

        {/** FOOTER */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})` }} />
        <div className="text-center py-2">
          <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-[0.25em]">
            {COMPANY.website} &nbsp;&middot;&nbsp; {COMPANY.email}
          </p>
        </div>
      </div>
    </div>
  );
}

