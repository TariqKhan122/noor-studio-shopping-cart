import type { Language } from '../types';

export function formatCurrency(amountUSD: number, language: Language): string {
  const locale = language === 'ur' ? 'ur-PK' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountUSD);
}

export function formatNumber(value: number, language: Language): string {
  const locale = language === 'ur' ? 'ur-PK' : 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

export function formatOrderDate(isoDate: string, language: Language): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const locale = language === 'ur' ? 'ur-PK' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
