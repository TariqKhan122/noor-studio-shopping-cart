import { useContext } from 'react';
import { CartContext, type CartContextValue } from '../context/CartContext';

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider (wrap your tree in AppProviders).');
  }
  return context;
}
