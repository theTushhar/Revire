import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { elevation, radii, dimensions, spacing } from '../../src/theme/dimensions';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceCanvas }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: insets.bottom > 0 ? insets.bottom : spacing.md,
            left: spacing.md,
            right: spacing.md,
            backgroundColor: colors.brandDark,
            height: dimensions.navBarHeight,
            borderRadius: radii.full,
            borderTopWidth: 0,
            paddingBottom: 0,
            paddingHorizontal: spacing.sm,
            ...elevation.bottomDock,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon="home-outline"
                label="Home"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon="check-circle-outline"
                label="Habits"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon="chart-line"
                label="Insights"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon="account-outline"
                label="Profile"
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

function TabIcon({ focused, icon, label }: { focused: boolean; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  if (focused) {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceCard,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: radii.full,
        height: 44,
      }}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.textPrimary} />
        <Text style={{
          ...typography.metadata,
          color: colors.textPrimary,
          marginLeft: 6,
          fontWeight: '600'
        }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      height: 44,
      width: 44,
    }}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.textTertiary} />
    </View>
  );
}
