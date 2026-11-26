import type { Language, LanguageAction, LanguageState, TextDirection } from '../types';

export function getDirectionForLanguage(language: Language): TextDirection {
  return language === 'ur' ? 'rtl' : 'ltr';
}

export const INITIAL_LANGUAGE_STATE: LanguageState = {
  language: 'en',
  direction: 'ltr',
};

export function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'SET_LANGUAGE': {
      return {
        language: action.payload,
        direction: getDirectionForLanguage(action.payload),
      };
    }

    case 'TOGGLE_LANGUAGE': {
      const nextLanguage: Language = state.language === 'en' ? 'ur' : 'en';
      return {
        language: nextLanguage,
        direction: getDirectionForLanguage(nextLanguage),
      };
    }

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
