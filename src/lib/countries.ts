/**
 * Single source of truth for country / state data across the app.
 *
 * Countries come from the `country-state-city` package (250 ISO 3166
 * countries, Rwanda included). Only the country dataset (~95KB) is bundled
 * statically; the state dataset is loaded lazily via `getStatesOfCountry()`
 * (dynamic deep-import of the state module only → separate async chunk).
 *
 * Legacy export shape: the old hand-written list exposed
 * `{ name, dial_code, code, length }`. That shape is preserved so existing
 * consumers (profile setup, admin user edit) keep working.
 */

import { Country } from "country-state-city";

export interface CountryEntry {
  /** Display name, e.g. "Rwanda" */
  name: string;
  /** E.164 dial code with leading +, e.g. "+250" */
  dial_code: string;
  /** ISO 3166-1 alpha-2 code, e.g. "RW" */
  code: string;
  /** Max national phone digits (E.164 fallback: 15) */
  length: number;
}

/**
 * Max national phone-number digits per ISO code, carried over from the
 * previous hand-written list. Countries not listed here fall back to 15
 * (the E.164 maximum).
 */
const PHONE_LENGTH_BY_ISO: Record<string, number> = {
  IN: 10,
  US: 10,
  GB: 10,
  CA: 10,
  AU: 9,
  DE: 11,
  FR: 9,
  JP: 10,
  CN: 11,
  BR: 11,
  RU: 10,
  IT: 10,
  ES: 9,
  MX: 10,
  KR: 10,
  ID: 11,
  TR: 10,
  SA: 9,
  AE: 9,
  ZA: 9,
  AR: 10,
  NL: 9,
  SE: 9,
  CH: 9,
  BE: 9,
  SG: 8,
  NZ: 9,
  IE: 9,
  NO: 8,
  DK: 8,
  FI: 9,
  PT: 9,
  PL: 9,
  GR: 10,
  PK: 10,
  BD: 10,
  VN: 9,
  PH: 10,
  TH: 9,
  MY: 9,
  EG: 10,
  IL: 9,
};

/**
 * Normalize a raw phonecode from the library into a clean `+<digits>` dial
 * code. The library has compound codes for 26 territories (e.g. "+1-684",
 * "+1-787 and 1-939") — take the first token and strip inner dashes.
 */
function normalizeDialCode(phonecode: string | undefined): string {
  if (!phonecode) return "";
  const first = phonecode.trim().split(/\s+/)[0].replace(/-/g, "");
  return first ? `+${first.replace(/^\+/, "")}` : "";
}

export const countries: CountryEntry[] = Country.getAllCountries().map((c) => ({
  name: c.name,
  dial_code: normalizeDialCode(c.phonecode),
  code: c.isoCode,
  length: PHONE_LENGTH_BY_ISO[c.isoCode] ?? 15,
}));

const byName = new Map<string, CountryEntry>();
const byIso = new Map<string, CountryEntry>();
for (const c of countries) {
  byName.set(c.name.toLowerCase(), c);
  byIso.set(c.code, c);
}

export function getCountryByName(name: string): CountryEntry | undefined {
  if (!name) return undefined;
  return byName.get(name.trim().toLowerCase());
}

export function getCountryByIso(isoCode: string): CountryEntry | undefined {
  if (!isoCode) return undefined;
  return byIso.get(isoCode.trim().toUpperCase());
}

export interface StateEntry {
  name: string;
  isoCode: string;
}

/**
 * States/provinces for an ISO country code, deduped by name (the library
 * has a few duplicates like Taiwan's Chiayi/Hsinchu city-vs-county pairs).
 *
 * Loaded LAZILY via a DEEP import of the state module only. Do NOT import
 * from the package root ("country-state-city") here — its index re-exports
 * `City`, which would drag the 8MB city dataset into the bundle.
 * Resolves to an empty array for countries with no state data (callers
 * should fall back to a free-text input).
 */
type StateModule = typeof import("country-state-city/lib/cjs/state");

let stateModuleCache: StateModule | null = null;

export async function getStatesOfCountry(
  isoCode: string,
): Promise<StateEntry[]> {
  if (!isoCode) return [];
  if (!stateModuleCache) {
    stateModuleCache = await import("country-state-city/lib/cjs/state");
  }
  const seen = new Set<string>();
  const out: StateEntry[] = [];
  for (const s of stateModuleCache.getStatesOfCountry(
    isoCode.trim().toUpperCase(),
  )) {
    if (seen.has(s.name)) continue;
    seen.add(s.name);
    out.push({ name: s.name, isoCode: s.isoCode });
  }
  return out;
}

/**
 * Legacy billing values stored before the full ISO list existed.
 * Normalized to canonical country names on load so old saved records
 * (e.g. "USA", "UK", "UAE") still display correctly.
 */
const LEGACY_COUNTRY_ALIASES: Record<string, string> = {
  USA: "United States",
  UK: "United Kingdom",
  UAE: "United Arab Emirates",
  "Hong Kong": "Hong Kong S.A.R.",
};

export function normalizeCountryName(name: string): string {
  if (!name) return name;
  const trimmed = name.trim();
  const aliased = LEGACY_COUNTRY_ALIASES[trimmed] ?? trimmed;
  const match = getCountryByName(aliased);
  return match ? match.name : trimmed;
}
