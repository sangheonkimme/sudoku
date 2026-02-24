export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || '';

export const ADSENSE_SLOTS = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD?.trim() || '',
  side: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDE?.trim() || '',
  bottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM?.trim() || '',
} as const;

export function isAdsenseEnabled(): boolean {
  return ADSENSE_CLIENT.startsWith('ca-pub-');
}
