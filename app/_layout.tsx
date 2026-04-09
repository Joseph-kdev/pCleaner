import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { TrashProvider } from '@/context/TrashContext';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Wrapper to consume theme hook
function RootLayoutNav() {
  const { theme, colors } = useAppTheme();

  return (
    <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <TrashProvider>
        <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal', 
              title: 'Trash Bin',
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
            }} 
          />
        </Stack>
      </TrashProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
