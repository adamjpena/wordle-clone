import '@testing-library/jest-dom/vitest';

if (!window.localStorage) {
  let store = new Map<string, string>();

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      clear: () => {
        store = new Map<string, string>();
      },
      getItem: (key: string) => store.get(key) ?? null,
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      removeItem: (key: string) => {
        store.delete(key);
      },
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      get length() {
        return store.size;
      },
    },
  });
}
