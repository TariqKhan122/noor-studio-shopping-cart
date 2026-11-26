import { PROMO_CODES } from '../data/promoCodes';
import type { CartAction, CartItem, CartState, CartTotals, PromoCode } from '../types';

export const FREE_SHIPPING_THRESHOLD_USD = 180;
export const STANDARD_SHIPPING_USD = 14;
export const TAX_RATE = 0.08;

export const INITIAL_CART_STATE: CartState = {
  items: [],
  promoCode: null,
  promoError: null,
  isDrawerOpen: false,
};

export function buildCartKey(productId: string, colorId: string, sizeId: string): string {
  return `${productId}::${colorId}::${sizeId}`;
}

export function computeSubtotalUSD(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceUSD * item.quantity, 0);
}

export function calculateCartTotals(items: CartItem[], promoCode: PromoCode | null): CartTotals {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotalUSD = roundCurrency(computeSubtotalUSD(items));

  let discountUSD = 0;
  if (promoCode && subtotalUSD >= promoCode.minSubtotalUSD && subtotalUSD > 0) {
    discountUSD =
      promoCode.discountType === 'percentage'
        ? roundCurrency((subtotalUSD * promoCode.value) / 100)
        : roundCurrency(Math.min(promoCode.value, subtotalUSD));
  }

  const discountedSubtotal = Math.max(0, roundCurrency(subtotalUSD - discountUSD));
  const shippingUSD =
    items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD_USD ? 0 : STANDARD_SHIPPING_USD;
  const taxUSD = roundCurrency(discountedSubtotal * TAX_RATE);
  const totalUSD = roundCurrency(discountedSubtotal + shippingUSD + taxUSD);
  const remainingForFreeShippingUSD = Math.max(
    0,
    roundCurrency(FREE_SHIPPING_THRESHOLD_USD - discountedSubtotal)
  );

  return {
    itemCount,
    subtotalUSD,
    discountUSD,
    shippingUSD,
    taxUSD,
    totalUSD,
    freeShippingThresholdUSD: FREE_SHIPPING_THRESHOLD_USD,
    remainingForFreeShippingUSD,
  };
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function reconcilePromoAfterCartChange(
  items: CartItem[],
  currentPromo: PromoCode | null
): { promoCode: PromoCode | null; promoError: CartState['promoError'] } {
  if (!currentPromo) {
    return { promoCode: null, promoError: null };
  }

  const subtotal = computeSubtotalUSD(items);
  if (items.length === 0) {
    return { promoCode: null, promoError: null };
  }

  if (subtotal < currentPromo.minSubtotalUSD) {
    return { promoCode: null, promoError: 'MIN_SUBTOTAL_NOT_MET' };
  }

  return { promoCode: currentPromo, promoError: null };
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, color, size, quantity = 1 } = action.payload;
      const safeQty = Math.max(1, Math.floor(quantity));
      const cartKey = buildCartKey(product.id, color.id, size.id);
      const unitPriceUSD = roundCurrency(product.priceUSD + size.priceDeltaUSD);
      const existingIndex = state.items.findIndex((item) => item.cartKey === cartKey);

      let nextItems: CartItem[];
      if (existingIndex > -1) {
        nextItems = state.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: Math.min(product.stock, item.quantity + safeQty) }
            : item
        );
      } else {
        const newItem: CartItem = {
          cartKey,
          productId: product.id,
          title: product.title,
          image: product.images[0] ?? '',
          accentPalette: product.accentPalette,
          unitPriceUSD,
          quantity: Math.min(product.stock, safeQty),
          color,
          size,
        };
        nextItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: nextItems,
        promoError: null,
      };
    }

    case 'REMOVE_ITEM': {
      const nextItems = state.items.filter((item) => item.cartKey !== action.payload.cartKey);
      const promoState = reconcilePromoAfterCartChange(nextItems, state.promoCode);
      return {
        ...state,
        items: nextItems,
        ...promoState,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { cartKey, quantity } = action.payload;
      const nextItems =
        quantity <= 0
          ? state.items.filter((item) => item.cartKey !== cartKey)
          : state.items.map((item) =>
              item.cartKey === cartKey ? { ...item, quantity: Math.floor(quantity) } : item
            );

      const promoState = reconcilePromoAfterCartChange(nextItems, state.promoCode);
      return {
        ...state,
        items: nextItems,
        ...promoState,
      };
    }

    case 'APPLY_PROMO_CODE': {
      const normalizedCode = action.payload.code.trim().toUpperCase();
      if (!normalizedCode) {
        return {
          ...state,
          promoCode: null,
          promoError: 'INVALID_CODE',
        };
      }

      const matchedPromo = PROMO_CODES[normalizedCode];
      if (!matchedPromo) {
        return {
          ...state,
          promoCode: null,
          promoError: 'INVALID_CODE',
        };
      }

      const subtotal = computeSubtotalUSD(state.items);
      if (subtotal < matchedPromo.minSubtotalUSD) {
        return {
          ...state,
          promoCode: null,
          promoError: 'MIN_SUBTOTAL_NOT_MET',
        };
      }

      return {
        ...state,
        promoCode: matchedPromo,
        promoError: null,
      };
    }

    case 'REMOVE_PROMO_CODE': {
      return {
        ...state,
        promoCode: null,
        promoError: null,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        promoCode: null,
        promoError: null,
      };
    }

    case 'TOGGLE_DRAWER': {
      return {
        ...state,
        isDrawerOpen: action.payload?.isOpen ?? !state.isDrawerOpen,
      };
    }

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
