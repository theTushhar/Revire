import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PillButton } from '../../components/PillButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/dimensions';
import { typography } from '../../theme/typography';
import { strings } from '../../theme/strings';

export function WelcomeScreen() {
  const handleProceed = () => {
    router.push('/(onboarding)/profile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <Text style={styles.wordmark}>{strings.appName}</Text>
        <View style={styles.heroArt}>
          <MaterialCommunityIcons name="cog-outline" size={72} color={colors.ink} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.headline}>{strings.tagline}</Text>
        <Text style={styles.subtitle}>{strings.welcomeSubtitle}</Text>

        <PillButton
          title={strings.getStarted}
          onPress={handleProceed}
          style={styles.cta}
          icon={<MaterialCommunityIcons name="arrow-right" size={18} color={colors.canvas} />}
        />

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="check-decagram-outline" size={14} color={colors.mute} />
            <Text style={styles.badgeText}>SCIENCE BACKED</Text>
          </View>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="chart-line" size={14} color={colors.mute} />
            <Text style={styles.badgeText}>DATA DRIVEN</Text>
          </View>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="lock-outline" size={14} color={colors.mute} />
            <Text style={styles.badgeText}>PRIVATE BY DESIGN</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  hero: {
    height: '42%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlow: {
    position: 'absolute',
    top: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.canvasSoft2,
  },
  wordmark: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    ...typography.headlineMd,
    color: colors.ink,
  },
  heroArt: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    ...typography.headlineXl,
    fontSize: 40,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.mute,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cta: {
    width: '100%',
    maxWidth: 280,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    opacity: 0.6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  badgeText: {
    ...typography.labelMono,
    fontSize: 10,
    color: colors.mute,
  },
});
