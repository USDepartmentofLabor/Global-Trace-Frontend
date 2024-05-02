export function setSessionStorage(key: string, value: App.Any): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(
      key,
      typeof value === 'object' ? JSON.stringify(value) : value,
    );
  }
}

export function setLocalStorage(key: string, value: App.Any): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      key,
      typeof value === 'object' ? JSON.stringify(value) : value,
    );
  }
}

export function getSessionStorage(key: string): string {
  if (typeof window !== 'undefined') {
    const value = window.sessionStorage.getItem(key);
    try {
      if (value) {
        return JSON.parse(value);
      }
      return value;
    } catch (e) {
      // handle error
    }
    return value;
  }
  return null;
}

export function getLocalStorage(key: string): string {
  if (typeof window !== 'undefined') {
    const value = window.localStorage.getItem(key);
    try {
      if (value) {
        return JSON.parse(value);
      }
      return value;
    } catch (e) {
      // handle error
    }
    return value;
  }
  return null;
}

export function removeSessionStorage(key: string): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(key);
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}

export function clearAllSessionStorage(): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.clear();
  }
}

export function clearAllLocalStorage(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
}
