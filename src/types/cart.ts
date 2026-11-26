import type { LocalizedText } from './language';
import type { Product, ProductColorVariant, ProductSizeVariant } from './product';

export interface CartItem {
  cartKey: string;
  productId: string;
  title: LocalizedText;
  image: string;
  accentPalette: [string, string];
  unitPriceUSD: number;
  quantity: number;
  color: ProductColorVariant;
  size: ProductSizeVariant;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSubtotalUSD: number;
  label: LocalizedText;
}

export type PromoErrorReason = 'INVALID_CODE' | 'MIN_SUBTOTAL_NOT_MET';

export interface CartState {
  items: CartItem[];
  promoCode: PromoCode | null;
  promoError: PromoErrorReason | null;
  isDrawerOpen: boolean;
}

export interface CartTotals {
  itemCount: number;
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  taxUSD: number;
  totalUSD: number;
  freeShippingThresholdUSD: number;
  remainingForFreeShippingUSD: number;
}

export type CartAction =
  | {
      type: 'ADD_ITEM';
      payload: {
        product: Product;
        color: ProductColorVariant;
        size: ProductSizeVariant;
        quantity?: number;
      };
    }
  | {
      type: 'REMOVE_ITEM';
      payload: {
        cartKey: string;
      };
    }
  | {
      type: 'UPDATE_QUANTITY';
      payload: {
        cartKey: string;
        quantity: number;
      };
    }
  | {
      type: 'APPLY_PROMO_CODE';
      payload: {
        code: string;
      };
    }
  | {
      type: 'REMOVE_PROMO_CODE';
    }
  | {
      type: 'CLEAR_CART';
    }
  | {
      type: 'TOGGLE_DRAWER';
      payload?: {
        isOpen?: boolean;
      };
    };
