export interface IndianStateEntry {
  numericCode: string;
  alphaCode: string;
  name: string;
}

export const INDIAN_STATES: IndianStateEntry[] = [
  { numericCode: "01", alphaCode: "JK", name: "Jammu and Kashmir" },
  { numericCode: "02", alphaCode: "HP", name: "Himachal Pradesh" },
  { numericCode: "03", alphaCode: "PB", name: "Punjab" },
  { numericCode: "04", alphaCode: "CH", name: "Chandigarh" },
  { numericCode: "05", alphaCode: "UK", name: "Uttarakhand" },
  { numericCode: "06", alphaCode: "HR", name: "Haryana" },
  { numericCode: "07", alphaCode: "DL", name: "Delhi" },
  { numericCode: "08", alphaCode: "RJ", name: "Rajasthan" },
  { numericCode: "09", alphaCode: "UP", name: "Uttar Pradesh" },
  { numericCode: "10", alphaCode: "BR", name: "Bihar" },
  { numericCode: "11", alphaCode: "SK", name: "Sikkim" },
  { numericCode: "12", alphaCode: "AR", name: "Arunachal Pradesh" },
  { numericCode: "13", alphaCode: "NL", name: "Nagaland" },
  { numericCode: "14", alphaCode: "MN", name: "Manipur" },
  { numericCode: "15", alphaCode: "MZ", name: "Mizoram" },
  { numericCode: "16", alphaCode: "TR", name: "Tripura" },
  { numericCode: "17", alphaCode: "ML", name: "Meghalaya" },
  { numericCode: "18", alphaCode: "AS", name: "Assam" },
  { numericCode: "19", alphaCode: "WB", name: "West Bengal" },
  { numericCode: "20", alphaCode: "JH", name: "Jharkhand" },
  { numericCode: "21", alphaCode: "OD", name: "Odisha" },
  { numericCode: "22", alphaCode: "CG", name: "Chhattisgarh" },
  { numericCode: "23", alphaCode: "MP", name: "Madhya Pradesh" },
  { numericCode: "24", alphaCode: "GJ", name: "Gujarat" },
  { numericCode: "25", alphaCode: "DD", name: "Daman and Diu" },
  { numericCode: "26", alphaCode: "DN", name: "Dadra and Nagar Haveli" },
  { numericCode: "27", alphaCode: "MH", name: "Maharashtra" },
  { numericCode: "28", alphaCode: "AP", name: "Andhra Pradesh" },
  { numericCode: "29", alphaCode: "KA", name: "Karnataka" },
  { numericCode: "30", alphaCode: "GA", name: "Goa" },
  { numericCode: "31", alphaCode: "LD", name: "Lakshadweep" },
  { numericCode: "32", alphaCode: "KL", name: "Kerala" },
  { numericCode: "33", alphaCode: "TN", name: "Tamil Nadu" },
  { numericCode: "34", alphaCode: "PY", name: "Puducherry" },
  { numericCode: "35", alphaCode: "AN", name: "Andaman and Nicobar Islands" },
  { numericCode: "36", alphaCode: "TG", name: "Telangana" },
  { numericCode: "37", alphaCode: "AP", name: "Andhra Pradesh (New)" },
  { numericCode: "38", alphaCode: "LA", name: "Ladakh" },
];

const byName = new Map<string, IndianStateEntry>();
for (const s of INDIAN_STATES) {
  byName.set(s.name.toLowerCase(), s);
}

export function getIndianStateCode(stateName: string): string | null {
  if (!stateName) return null;
  const entry = byName.get(stateName.trim().toLowerCase());
  return entry ? entry.numericCode : null;
}

export function getIndianStateFromGstin(gstin: string): { name: string; stateCode: string } | null {
  if (!gstin || gstin.length < 2) return null;
  const prefix = gstin.substring(0, 2);
  for (const s of INDIAN_STATES) {
    if (s.numericCode === prefix) return { name: s.name, stateCode: s.numericCode };
  }
  return null;
}
