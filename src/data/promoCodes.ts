import type { PromoCode } from '../types';

export const PROMO_CODES: Record<string, PromoCode> = {
  WELCOME10: {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    minSubtotalUSD: 0,
    label: {
      en: '10% Welcome Privilege',
      ur: '10% خوش آمدید رعایت',
    },
  },
  SAVE15: {
    code: 'SAVE15',
    discountType: 'percentage',
    value: 15,
    minSubtotalUSD: 150,
    label: {
      en: '15% Atelier Savings ($150+)',
      ur: '15% اسٹوڈیو بچت ($150+ پر)',
    },
  },
  NOOR25: {
    code: 'NOOR25',
    discountType: 'fixed',
    value: 25,
    minSubtotalUSD: 120,
    label: {
      en: '$25 Curated Credit ($120+)',
      ur: '$25 خاص کریڈٹ ($120+ پر)',
    },
  },
};
