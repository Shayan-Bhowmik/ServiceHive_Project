import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const themeStorageKey = 'smart-leads-theme';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const setTheme = (nextTheme: ThemeMode): void => {
    setThemeState(nextTheme);
  };

  const toggleTheme = (): void => {
    setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
