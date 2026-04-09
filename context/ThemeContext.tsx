import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { createMMKV } from 'react-native-mmkv';
import { Colors } from '@/constants/theme';

export const storage = createMMKV();

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof Colors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const deviceTheme = useDeviceColorScheme() || 'light';
  
  // Initialize from MMKV synchronously to avoid flash of incorrect theme
  const [theme, setTheme] = useState<ThemeType>(() => {
    const storedTheme = storage.getString('app_theme') as ThemeType;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return deviceTheme;
  });

  // Keep in sync with device theme if no preference is saved
  useEffect(() => {
    const storedTheme = storage.getString('app_theme');
    if (!storedTheme && deviceTheme !== theme) {
      setTheme(deviceTheme);
    }
  }, [deviceTheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      storage.set('app_theme', newTheme);
      return newTheme;
    });
  };

  const colors = Colors[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
