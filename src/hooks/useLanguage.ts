import { useContext } from 'react';
import { LanguageContext, type LanguageContextValue } from '../context/LanguageContext';

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider (wrap your tree in AppProviders).'
    );
  }
  return context;
}
