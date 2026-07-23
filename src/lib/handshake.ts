export function getAvailableSlots(level: number): number {
  return Math.min(level + 11, 20);
}

export function getLevelFromCompleted(count: number): number {
  return Math.min(Math.floor(count / 2) + 1, 9);
}

export const MAX_HANDSHAKE_LEVEL = 9;
