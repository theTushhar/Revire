import React, { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RealmProvider } from '../src/services/Database';
import { colors } from '../src/theme/colors';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.ink,
    background: colors.background,
    surface: colors.canvas,
    error: colors.error,
  },
};

function RootLayoutInner() {
  const [isOnboardingLoaded, setIsOnboardingLoaded] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const segments = useSegments();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const value = await AsyncStorage.getItem('onboarding_complete');
        setOnboardingComplete(value === 'true');
      } catch {
        setOnboardingComplete(false);
      } finally {
        setIsOnboardingLoaded(true);
      }
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!isOnboardingLoaded || onboardingComplete === null) return;

    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!onboardingComplete && !inOnboardingGroup) {
      router.replace('/(onboarding)');
    } else if (onboardingComplete && inOnboardingGroup) {
      router.replace('/(tabs)');
    }
  }, [isOnboardingLoaded, onboardingComplete, segments]);

  if (!isOnboardingLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="habits/add" options={{ presentation: 'modal' }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <RealmProvider>
      <RootLayoutInner />
    </RealmProvider>
  );
}
