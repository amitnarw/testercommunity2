/**
 * Handshake level ladder (spec): L0 = new user (0 completions),
 * L1 = 10, L2 = 25, L3 = 50, L4 = 100, L5 = 250, L6 = 500,
 * L7 = 1000, L8 = 2500, L9 (max) = 5000.
 *
 * Mirrors the backend level_config table + getLevelFromCompletedCount.
 * Slots: 12 at L0, +1 per level, capped at 20 (mirrors getAvailableSlots).
 */
export const LEVEL_THRESHOLDS: Array<{ level: number; tests: number }> = [
  { level: 0, tests: 0 },
  { level: 1, tests: 10 },
  { level: 2, tests: 25 },
  { level: 3, tests: 50 },
  { level: 4, tests: 100 },
  { level: 5, tests: 250 },
  { level: 6, tests: 500 },
  { level: 7, tests: 1000 },
  { level: 8, tests: 2500 },
  { level: 9, tests: 5000 },
];

export function getAvailableSlots(level: number): number {
  const lvl = Math.min(Math.max(level, 0), MAX_HANDSHAKE_LEVEL);
  return Math.min(20, 12 + lvl);
}

export function getLevelFromCompleted(count: number): number {
  let level = 0;
  for (const t of LEVEL_THRESHOLDS) {
    if (count >= t.tests) level = t.level;
    else break;
  }
  return Math.min(level, MAX_HANDSHAKE_LEVEL);
}

export function getNextLevelThreshold(level: number): number | null {
  const next = LEVEL_THRESHOLDS.find((t) => t.level === level + 1);
  return next ? next.tests : null;
}

export const MAX_HANDSHAKE_LEVEL = 9;
