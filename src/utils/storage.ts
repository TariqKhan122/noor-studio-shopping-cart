/**
 * Safe localStorage persistence utilities with SSR & malformed JSON guards.
 */

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStorageJSON<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }

    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) {
      return fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeStorageJSON<T>(key: string, value: T): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota exceeded or private-browsing storage restrictions gracefully
  }
}

export function removeStorageKey(key: string): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage access errors
  }
}
