"use client";

import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { InvoiceDetail } from "@/lib/types";

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

  const currency = payment?.currency || "INR";
  const subtotal = payment?.amount || (invoice.unit_price || 0) * (invoice.quantity || 1);
  const cgstAmount = invoice.cgst_amount || 0;
  const sgstAmount = invoice.sgst_amount || 0;
  const igstAmount = invoice.igst_amount || 0;
  const totalAmount = subtotal + cgstAmount + sgstAmount + igstAmount;
  const quantity = invoice.quantity || (order?.packageCount || 1);
  const unitPrice = invoice.unit_price || Math.round(subtotal / quantity);

  const invoiceDate = invoice.createdAt ? format(new Date(invoice.createdAt), "dd MMM yyyy") : "\u2014";

  return (
    <div className="bg-white text-slate-800 print-card relative overflow-hidden" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      {/** CONTENT */}
      <div className="relative">
        {/** TOP ACCENT LINE */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})` }} />

        {/** HEADER */}
        <div className="px-10 pt-7 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center p-2 shrink-0" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})` }}>
                <Image src="/inTesters-logo.svg" alt="inTesters" width={36} height={36} className="object-contain brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{COMPANY.brandName}</h1>
                <p className="text-slate-400 text-sm font-medium mt-0.5">Professional App Testing Community</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex flex-col items-end">
                <h2 className="text-3xl font-black uppercase tracking-tight" style={{ color: PRIMARY }}>Tax Invoice</h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No.</span>
                  <span className="font-mono text-sm font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">{invoice.invoice_number}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-4 py-1.5 rounded-lg text-sm font-extrabold uppercase tracking-widest text-white bg-emerald-500">
                    Paid
                  </span>
                  {isExport && (
                    <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: PRIMARY }}>
                      Export of Services
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 h-px bg-slate-100" />

        {/** SELLER + INVOICE DETAILS */}
        <div className="px-10 py-5">
          <div className="grid grid-cols-2 print-grid-2col gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: PRIMARY }}>Sold By</p>
              <p className="text-[15px] font-bold text-slate-900 leading-snug">{COMPANY.name}</p>
              <div className="mt-2 space-y-0.5 text-sm text-slate-500 leading-relaxed">
                <p>{COMPANY.addressLine1}</p>
                <p>{COMPANY.addressLine2}</p>
                <p>{COMPANY.city}, {COMPANY.state} &mdash; {COMPANY.pincode}</p>
                <p>{COMPANY.country}</p>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">GSTIN</span>
                  <span className="font-mono font-semibold text-slate-700">{COMPANY.gstin}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">PAN</span>
                  <span className="font-mono font-semibold text-slate-700">{COMPANY.pan}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">Email</span>
                  <span className="text-slate-600">{COMPANY.email}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: PRIMARY }}>Invoice Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Invoice No.</span>
                  <span className="font-mono font-bold text-slate-800">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Date</span>
                  <span className="font-semibold text-slate-800">{invoiceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Supply Type</span>
                  <span className="font-medium text-slate-700">{invoice.supply_type || (isExport ? "Export of Services" : "Supply of Services")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Place of Supply</span>
                  <span className="font-medium text-slate-700">{invoice.place_of_supply || "\u2014"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Currency</span>
                  <span className="font-bold text-slate-800">{currency}</span>
                </div>
                {invoice.lut_number && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Export LUT</span>
                    <span className="font-mono font-medium text-slate-700">{invoice.lut_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 h-px bg-slate-100" />

        {/** BUYER + NATURE */}
        <div className="px-10 py-3">
          <div className="grid grid-cols-2 print-grid-2col gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: PRIMARY }}>Bill To</p>
              <p className="text-[13px] font-bold text-slate-900 leading-snug">{billingInfo?.name || user?.name || "Customer"}</p>
              {userDetail?.company_name && <p className="text-xs font-semibold text-slate-600 mt-0.5">{userDetail.company_name}</p>}
              <div className="mt-1.5 space-y-0 text-xs text-slate-500 leading-relaxed">
                {billingInfo?.address && <p>{billingInfo.address}</p>}
                {(billingInfo?.city || billingInfo?.state || billingInfo?.zipCode) && (
                  <p>{[billingInfo?.city, billingInfo?.state, billingInfo?.zipCode].filter(Boolean).join(", ")}</p>
                )}
                {billingInfo?.country && <p>{billingInfo.country}</p>}
              </div>
              <div className="mt-2 space-y-0.5 text-xs">
                {billingInfo?.gstin && (
                  <div className="flex gap-2">
                    <span className="text-slate-400 font-medium w-14 shrink-0">GSTIN</span>
                    <span className="font-mono font-semibold text-slate-700">{billingInfo.gstin}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-slate-400 font-medium w-14 shrink-0">Email</span>
                  <span className="text-slate-600">{billingInfo?.email || user?.email}</span>
                </div>
              </div>
            </div>
            <div>
              {isExport ? (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: PRIMARY }}>Nature of Export</p>
                  <p className="text-[15px] font-semibold text-slate-800 leading-snug">Professional App Testing Services</p>
                  <p className="text-sm text-slate-500 mt-1">Zero-Rated Supply (Export under LUT without payment of Integrated Tax)</p>
                </>
              ) : (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: PRIMARY }}>Nature of Supply</p>
                  <p className="text-[15px] font-semibold text-slate-800 leading-snug">Professional App Testing Services</p>
                  {billingInfo?.gstin && (
                    <div className="mt-2 flex gap-2 text-sm">
                      <span className="text-slate-400 font-medium">Buyer GSTIN:</span>
                      <span className="font-mono font-semibold text-slate-700">{billingInfo.gstin}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 h-px bg-slate-100" />

        {/** ITEMS TABLE */}
        <div className="px-10 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: PRIMARY }}>Service Details</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: PRIMARY }}>
                <th className="pb-2 text-left font-semibold text-slate-500 w-8 text-xs">#</th>
                <th className="pb-2 text-left font-semibold text-slate-500 text-xs">Description</th>
                <th className="pb-2 text-center font-semibold text-slate-500 text-xs">SAC</th>
                <th className="pb-2 text-center font-semibold text-slate-500 text-xs">Qty</th>
                <th className="pb-2 text-right font-semibold text-slate-500 text-xs">Rate</th>
                <th className="pb-2 text-right font-semibold text-slate-500 text-xs">Amount ({currency})</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 text-slate-400 text-center">1</td>
                <td className="py-3">
                  <p className="font-semibold text-slate-900">{invoice.service_name || "Android App Testing Package"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Professional App Testing Services</p>
                </td>
                <td className="py-3 text-center font-mono text-slate-500 text-xs">{invoice.sac_code || COMPANY.sacCode}</td>
                <td className="py-3 text-center font-semibold text-slate-800">{quantity}</td>
                <td className="py-3 text-right font-medium text-slate-700">{formatCurrency(unitPrice, currency)}</td>
                <td className="py-3 text-right font-bold text-slate-900">{formatCurrency(subtotal, currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 h-px bg-slate-100" />

        {/** TOTALS */}
        <div className="px-10 py-5">
          <div className="grid grid-cols-2 print-grid-2col gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: PRIMARY }}>Amount in Words</p>
              <p className="text-sm font-medium text-slate-600 italic">
                {formatAmountInWords(invoice.amount_in_words, totalAmount, currency)}
              </p>
            </div>
            <div className="space-y-0">
              <div className="flex justify-between py-2 text-sm border-b border-slate-100">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-semibold text-slate-700">{formatCurrency(subtotal, currency)}</span>
              </div>
              {isIndia && isDelhi && !isExport ? (
                <>
                  <div className="flex justify-between py-2 text-sm border-b border-slate-100">
                    <span className="text-slate-400">CGST @ 9%</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(cgstAmount, currency)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm border-b border-slate-100">
                    <span className="text-slate-400">SGST @ 9%</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(sgstAmount, currency)}</span>
                  </div>
                </>
              ) : isIndia && !isExport ? (
                <div className="flex justify-between py-2 text-sm border-b border-slate-100">
                  <span className="text-slate-400">IGST @ 18%</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(igstAmount, currency)}</span>
                </div>
              ) : (
                <div className="flex justify-between py-2 text-sm border-b border-slate-100">
                  <span className="text-slate-400">IGST @ 0% (Zero-rated)</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(0, currency)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-base font-bold text-slate-900 mt-1 rounded-lg px-3" style={{ backgroundColor: PRIMARY_LIGHT }}>
                <span>Total</span>
                <span>{formatCurrency(totalAmount, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/** DIVIDER */}
        <div className="mx-10 h-px bg-slate-100" />

        {/** DECLARATION + SIGNATORY */}
        <div className="px-10 py-5">
          <div className="grid grid-cols-2 print-grid-2col gap-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: PRIMARY }}>Declaration</p>
              <p className="text-xs text-slate-400 leading-relaxed">This is a computer-generated tax invoice. {isExport && "Supply meant for Export under LUT without payment of Integrated Tax. "}E&amp;OE; Subject to {COMPANY.stateName} jurisdiction.</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-16">For {COMPANY.name}</p>
              <div className="border-t-2 border-slate-800 pt-2 inline-block min-w-[160px]">
                <p className="text-xs text-slate-500 font-medium">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </div>

        {/** FOOTER */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${PRIMARY_DARK})` }} />
        <div className="text-center py-3">
          <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-[0.25em]">
            {COMPANY.website} &nbsp;&middot;&nbsp; {COMPANY.email}
          </p>
        </div>
      </div>
    </div>
  );
}

