import { createContext, useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { TRANSLATIONS } from '../data/translations';
import {
  getDirectionForLanguage,
  INITIAL_LANGUAGE_STATE,
  languageReducer,
} from '../reducers/languageReducer';
import type {
  Language,
  LanguageState,
  LocalizedText,
  TextDirection,
  TranslationDictionary,
} from '../types';
import { readStorageJSON, writeStorageJSON } from '../utils/storage';

const LANGUAGE_STORAGE_KEY = 'noor_studio_lang_v1';

export interface LanguageContextValue {
  language: Language;
  direction: TextDirection;
  isRTL: boolean;
  t: TranslationDictionary;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  localize: (text: LocalizedText) => string;
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function isValidLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'ur';
}

function loadInitialLanguageState(): LanguageState {
  const savedLanguage = readStorageJSON<Language>(
    LANGUAGE_STORAGE_KEY,
    INITIAL_LANGUAGE_STATE.language,
    isValidLanguage
  );

  return {
    language: savedLanguage,
    direction: getDirectionForLanguage(savedLanguage),
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(languageReducer, undefined, loadInitialLanguageState);

  useEffect(() => {
    writeStorageJSON(LANGUAGE_STORAGE_KEY, state.language);

    if (typeof document !== 'undefined') {
      document.documentElement.dir = state.direction;
      document.documentElement.lang = state.language;
    }
  }, [state.language, state.direction]);

  const setLanguage = useCallback((language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  }, []);

  const toggleLanguage = useCallback(() => {
    dispatch({ type: 'TOGGLE_LANGUAGE' });
  }, []);

  const localize = useCallback(
    (text: LocalizedText) => text[state.language],
    [state.language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language: state.language,
      direction: state.direction,
      isRTL: state.direction === 'rtl',
      t: TRANSLATIONS[state.language],
      setLanguage,
      toggleLanguage,
      localize,
    }),
    [state.language, state.direction, setLanguage, toggleLanguage, localize]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
