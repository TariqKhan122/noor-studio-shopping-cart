import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../App';
import { AppProviders } from '../context/AppProviders';
import { PRODUCTS } from '../data/products';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import { authReducer, INITIAL_AUTH_STATE } from '../reducers/authReducer';
import { calculateCartTotals, cartReducer, INITIAL_CART_STATE } from '../reducers/cartReducer';
import type { OrderRecord, UserProfile } from '../types';

beforeAll(() => {
  if (typeof window.localStorage === 'undefined') {
    const store = new Map<string, string>();
    const memoryStorage: Storage = {
      get length() {
        return store.size;
      },
      clear: () => store.clear(),
      getItem: (key: string) => store.get(key) ?? null,
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      removeItem: (key: string) => {
        store.delete(key);
      },
      setItem: (key: string, value: string) => {
        store.set(key, String(value));
      },
    };
    Object.defineProperty(window, 'localStorage', {
      value: memoryStorage,
      configurable: true,
    });
  }
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
});

describe('cartReducer', () => {
  const speaker = PRODUCTS[0];
  const colorA = speaker.colors[0];
  const colorB = speaker.colors[1];
  const sizeA = speaker.sizes[0];
  const sizeB = speaker.sizes[1];

  it('adds items, separates variants by cartKey, and increments matching variant quantity', () => {
    let state = cartReducer(INITIAL_CART_STATE, {
      type: 'ADD_ITEM',
      payload: { product: speaker, color: colorA, size: sizeA, quantity: 1 },
    });

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);

    // Same variant increments quantity
    state = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { product: speaker, color: colorA, size: sizeA, quantity: 2 },
    });
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);

    // Different color/size creates separate cart line with size priceDeltaUSD
    state = cartReducer(state, {
      type: 'ADD_ITEM',
      payload: { product: speaker, color: colorB, size: sizeB, quantity: 1 },
    });
    expect(state.items).toHaveLength(2);
    expect(state.items[1].unitPriceUSD).toBe(speaker.priceUSD + sizeB.priceDeltaUSD);
  });

  it('updates quantity, removes on zero, applies promo codes, and clears cart', () => {
    let state = cartReducer(INITIAL_CART_STATE, {
      type: 'ADD_ITEM',
      payload: { product: speaker, color: colorA, size: sizeA, quantity: 1 },
    });

    // Apply SAVE15 (subtotal 245 >= 150)
    state = cartReducer(state, { type: 'APPLY_PROMO_CODE', payload: { code: 'save15' } });
    expect(state.promoCode?.code).toBe('SAVE15');
    expect(state.promoError).toBeNull();

    const totals = calculateCartTotals(state.items, state.promoCode);
    expect(totals.subtotalUSD).toBe(245);
    expect(totals.discountUSD).toBe(36.75);
    expect(totals.shippingUSD).toBe(0);

    // Invalid promo code sets error
    const badPromoState = cartReducer(state, {
      type: 'APPLY_PROMO_CODE',
      payload: { code: 'NOTREAL' },
    });
    expect(badPromoState.promoError).toBe('INVALID_CODE');
    expect(badPromoState.promoCode).toBeNull();

    // Updating quantity to 0 removes item
    state = cartReducer(state, {
      type: 'UPDATE_QUANTITY',
      payload: { cartKey: state.items[0].cartKey, quantity: 0 },
    });
    expect(state.items).toHaveLength(0);
    expect(state.promoCode).toBeNull();

    // Toggle drawer & clear cart
    state = cartReducer(state, { type: 'TOGGLE_DRAWER', payload: { isOpen: true } });
    expect(state.isDrawerOpen).toBe(true);
    state = cartReducer(state, { type: 'CLEAR_CART' });
    expect(state.items).toHaveLength(0);
  });
});

describe('authReducer', () => {
  const sampleUser: UserProfile = {
    id: 'usr_1',
    name: 'Amira Siddiqui',
    email: 'amira@noorstudio.com',
    city: 'Lahore',
    memberSince: '2026-01-01',
    isDemo: true,
    orders: [],
  };

  it('handles LOGIN_SUCCESS, UPDATE_PROFILE, RECORD_ORDER, and LOGOUT', () => {
    let state = authReducer(INITIAL_AUTH_STATE, {
      type: 'LOGIN_SUCCESS',
      payload: sampleUser,
    });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe('Amira Siddiqui');

    state = authReducer(state, {
      type: 'UPDATE_PROFILE',
      payload: { name: 'Amira K.', city: 'Islamabad' },
    });
    expect(state.user?.name).toBe('Amira K.');
    expect(state.user?.city).toBe('Islamabad');

    const order: OrderRecord = {
      id: 'NR-123456',
      createdAt: '2026-11-25T10:00:00Z',
      items: [],
      subtotalUSD: 100,
      discountUSD: 0,
      shippingUSD: 14,
      taxUSD: 8,
      totalUSD: 122,
      promoCodeUsed: null,
      shippingAddress: {
        fullName: 'Amira K.',
        email: 'amira@noorstudio.com',
        phone: '03001234567',
        streetAddress: '12 Street',
        city: 'Islamabad',
        postalCode: '44000',
        country: 'Pakistan',
      },
      paymentMethod: 'card',
      status: 'confirmed',
    };

    state = authReducer(state, { type: 'RECORD_ORDER', payload: order });
    expect(state.user?.orders).toHaveLength(1);
    expect(state.user?.orders[0].id).toBe('NR-123456');

    state = authReducer(state, { type: 'LOGOUT' });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});

describe('Custom hook boundaries and persistence', () => {
  it('throws clear runtime errors when hooks are used outside Providers', () => {
    function BrokenCartConsumer() {
      useCart();
      return null;
    }
    function BrokenAuthConsumer() {
      useAuth();
      return null;
    }
    function BrokenLanguageConsumer() {
      useLanguage();
      return null;
    }

    expect(() => render(<BrokenCartConsumer />)).toThrow(/useCart must be used within a CartProvider/);
    expect(() => render(<BrokenAuthConsumer />)).toThrow(/useAuth must be used within an AuthProvider/);
    expect(() => render(<BrokenLanguageConsumer />)).toThrow(/useLanguage must be used within a LanguageProvider/);
  });

  it('toggles language between en/ltr and ur/rtl and survives corrupted localStorage', () => {
    window.localStorage.setItem('noor_studio_cart_v1', '{broken_json');
    window.localStorage.setItem('noor_studio_auth_v1', '{broken_json');
    window.localStorage.setItem('noor_studio_lang_v1', '"invalid"');

    function LanguageProbe() {
      const { language, direction, toggleLanguage } = useLanguage();
      const { totals } = useCart();
      return (
        <div>
          <span data-testid="lang-state">
            {language}:{direction}:{totals.itemCount}
          </span>
          <button type="button" onClick={toggleLanguage}>
            Switch
          </button>
        </div>
      );
    }

    render(
      <AppProviders>
        <LanguageProbe />
      </AppProviders>
    );

    expect(screen.getByTestId('lang-state').textContent).toBe('en:ltr:0');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');

    fireEvent.click(screen.getByText('Switch'));

    expect(screen.getByTestId('lang-state').textContent).toBe('ur:rtl:0');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ur');
    expect(window.localStorage.getItem('noor_studio_lang_v1')).toBe('"ur"');
  });

  it('protects checkout route, redirects back after demo login, and completes order flow', () => {
    window.history.pushState({}, '', '/checkout');

    // Pre-populate cart via storage before rendering App
    window.localStorage.setItem(
      'noor_studio_cart_v1',
      JSON.stringify({
        items: [
          {
            cartKey: `${PRODUCTS[0].id}::${PRODUCTS[0].colors[0].id}::${PRODUCTS[0].sizes[0].id}`,
            productId: PRODUCTS[0].id,
            title: PRODUCTS[0].title,
            image: PRODUCTS[0].images[0],
            accentPalette: PRODUCTS[0].accentPalette,
            unitPriceUSD: PRODUCTS[0].priceUSD,
            quantity: 1,
            color: PRODUCTS[0].colors[0],
            size: PRODUCTS[0].sizes[0],
          },
        ],
        promoCodeId: null,
      })
    );

    render(<App />);

    // Should be redirected to LoginPage with protected notice
    expect(screen.getByText('Enter Noor Studio')).toBeTruthy();

    // Click One-Click Demo Member Login
    fireEvent.click(screen.getByText('One-Click Demo Member Login'));

    // Should seamlessly return to CheckoutPage
    expect(screen.getByText('Atelier Checkout')).toBeTruthy();

    // Complete order
    fireEvent.click(screen.getByText('Complete Order'));

    // Receipt should appear and cart count should reset to 0
    expect(screen.getByText('Order Confirmed')).toBeTruthy();
    expect(screen.getByLabelText('Bag (0)')).toBeTruthy();
  });
});
