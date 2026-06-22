import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "INR",
  options: { isSmallestUnit?: boolean } = {}
): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "—";
  }
  const { isSmallestUnit = true } = options;
  const value = isSmallestUnit ? amount / 100 : amount;
  const currencyUpper = (currency || "INR").toUpperCase();

  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
    AED: "د.إ",
    JPY: "¥",
  };

  const symbol = symbols[currencyUpper] || `${currencyUpper} `;
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

