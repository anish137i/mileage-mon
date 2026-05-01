import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { MileageProvider, useMileage } from '../context/MileageContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootContent() {
  const { colorScheme } = useMileage();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-entry" options={{ presentation: 'modal', title: 'Add Entry' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <MileageProvider>
      <RootContent />
    </MileageProvider>
  );
}
