import type { LocalizedText } from './language';

export type ProductCategory = 'tech' | 'desk' | 'home' | 'craft';
export type CategoryFilter = 'all' | ProductCategory;

export interface ProductColorVariant {
  id: string;
  hex: string;
  label: LocalizedText;
}

export interface ProductSizeVariant {
  id: string;
  label: LocalizedText;
  priceDeltaUSD: number;
}

export interface ProductSpec {
  label: LocalizedText;
  value: LocalizedText;
}

export interface Product {
  id: string;
  slug: string;
  category: ProductCategory;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  priceUSD: number;
  badge?: LocalizedText;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  accentPalette: [string, string];
  artisanOrigin: LocalizedText;
  colors: ProductColorVariant[];
  sizes: ProductSizeVariant[];
  specs: ProductSpec[];
}
