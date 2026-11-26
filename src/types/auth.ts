import type { CartItem } from './cart';

export type PaymentMethod = 'card' | 'cod' | 'wallet';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  taxUSD: number;
  totalUSD: number;
  promoCodeUsed: string | null;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'confirmed';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  memberSince: string;
  isDemo: boolean;
  orders: OrderRecord[];
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | {
      type: 'LOGIN_SUCCESS';
      payload: UserProfile;
    }
  | {
      type: 'LOGOUT';
    }
  | {
      type: 'UPDATE_PROFILE';
      payload: {
        name?: string;
        city?: string;
        email?: string;
      };
    }
  | {
      type: 'RECORD_ORDER';
      payload: OrderRecord;
    };
