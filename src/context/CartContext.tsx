import { createContext, useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { PROMO_CODES } from '../data/promoCodes';
import {
  calculateCartTotals,
  cartReducer,
  INITIAL_CART_STATE,
} from '../reducers/cartReducer';
import type {
  CartItem,
  CartState,
  CartTotals,
  Product,
  ProductColorVariant,
  ProductSizeVariant,
  PromoCode,
} from '../types';
import { readStorageJSON, writeStorageJSON } from '../utils/storage';

const CART_STORAGE_KEY = 'noor_studio_cart_v1';

interface PersistedCartPayload {
  items: CartItem[];
  promoCodeId: string | null;
}

export interface CartContextValue {
  items: CartItem[];
  promoCode: PromoCode | null;
  promoError: CartState['promoError'];
  isDrawerOpen: boolean;
  totals: CartTotals;
  addItem: (
    product: Product,
    color: ProductColorVariant,
    size: ProductSizeVariant,
    quantity?: number
  ) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  clearCart: () => void;
  toggleDrawer: (isOpen?: boolean) => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);

function isValidCartItem(candidate: unknown): candidate is CartItem {
  if (typeof candidate !== 'object' || candidate === null) {
    return false;
  }

  const record = candidate as Record<string, unknown>;
  return (
    typeof record.cartKey === 'string' &&
    typeof record.productId === 'string' &&
    typeof record.unitPriceUSD === 'number' &&
    typeof record.quantity === 'number' &&
    record.quantity > 0 &&
    typeof record.title === 'object' &&
    record.title !== null &&
    typeof record.color === 'object' &&
    record.color !== null &&
    typeof record.size === 'object' &&
    record.size !== null
  );
}

function isPersistedCartPayload(value: unknown): value is PersistedCartPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.items) &&
    record.items.every(isValidCartItem) &&
    (record.promoCodeId === null || typeof record.promoCodeId === 'string')
  );
}

function loadInitialCartState(): CartState {
  const persisted = readStorageJSON<PersistedCartPayload>(
    CART_STORAGE_KEY,
    { items: [], promoCodeId: null },
    isPersistedCartPayload
  );

  const restoredPromo =
    persisted.promoCodeId && PROMO_CODES[persisted.promoCodeId]
      ? PROMO_CODES[persisted.promoCodeId]
      : null;

  const subtotal = persisted.items.reduce(
    (sum, item) => sum + item.unitPriceUSD * item.quantity,
    0
  );

  const validPromo =
    restoredPromo && subtotal >= restoredPromo.minSubtotalUSD ? restoredPromo : null;

  return {
    ...INITIAL_CART_STATE,
    items: persisted.items,
    promoCode: validPromo,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCartState);

  useEffect(() => {
    const payload: PersistedCartPayload = {
      items: state.items,
      promoCodeId: state.promoCode ? state.promoCode.code : null,
    };
    writeStorageJSON(CART_STORAGE_KEY, payload);
  }, [state.items, state.promoCode]);

  const addItem = useCallback(
    (
      product: Product,
      color: ProductColorVariant,
      size: ProductSizeVariant,
      quantity = 1
    ) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: { product, color, size, quantity },
      });
    },
    []
  );

  const removeItem = useCallback((cartKey: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartKey } });
  }, []);

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartKey, quantity } });
  }, []);

  const applyPromoCode = useCallback((code: string) => {
    dispatch({ type: 'APPLY_PROMO_CODE', payload: { code } });
  }, []);

  const removePromoCode = useCallback(() => {
    dispatch({ type: 'REMOVE_PROMO_CODE' });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleDrawer = useCallback((isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_DRAWER', payload: isOpen !== undefined ? { isOpen } : undefined });
  }, []);

  const totals = useMemo(
    () => calculateCartTotals(state.items, state.promoCode),
    [state.items, state.promoCode]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      promoError: state.promoError,
      isDrawerOpen: state.isDrawerOpen,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      applyPromoCode,
      removePromoCode,
      clearCart,
      toggleDrawer,
    }),
    [
      state.items,
      state.promoCode,
      state.promoError,
      state.isDrawerOpen,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      applyPromoCode,
      removePromoCode,
      clearCart,
      toggleDrawer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
