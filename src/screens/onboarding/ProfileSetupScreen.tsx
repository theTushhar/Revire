import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../../components/Card';
import { PillButton } from '../../components/PillButton';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/dimensions';
import { typography } from '../../theme/typography';

const AVATARS = ['🦁', '🐯', '🐼', '🦊', '🦉', '🦅', '🐉', '🦄', '⚔️', '🛡️', '💎', '🚀'];

export function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleComplete = async () => {
    try {
      const finalName = name.trim() || 'Friend';
      await AsyncStorage.setItem('profile_name', finalName);
      await AsyncStorage.setItem('profile_avatar', selectedAvatar);
      await AsyncStorage.setItem('profile_joined_at', new Date().toISOString());
      await AsyncStorage.setItem('onboarding_complete', 'true');
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Failed to complete onboarding profile setup:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Setup</Text>
          <Text style={styles.subtitle}>Customize your avatar and display name.</Text>
        </View>

        <Text style={styles.label}>Display Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name..."
          placeholderTextColor={colors.mute}
          style={styles.textInput}
        />

        <Text style={styles.label}>Choose Avatar</Text>
        <Card style={styles.avatarCard} padding={spacing.md}>
          <View style={styles.avatarPreviewContainer}>
            <View style={styles.bigAvatarBg}>
              <Text style={styles.bigAvatarText}>{selectedAvatar}</Text>
            </View>
          </View>
          <View style={styles.avatarGrid}>
            {AVATARS.map((av) => {
              const isSelected = selectedAvatar === av;
              return (
                <Pressable
                  key={av}
                  onPress={() => setSelectedAvatar(av)}
                  style={[styles.avatarBubble, isSelected && styles.avatarBubbleSelected]}
                >
                  <Text style={styles.avatarText}>{av}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <View style={styles.footer}>
          <PillButton title="Complete Setup" onPress={handleComplete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.ink,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.mute,
    textAlign: 'center',
  },
  label: {
    ...typography.headlineSm,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.canvas,
    borderColor: colors.hairline,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    height: 50,
    color: colors.ink,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  avatarCard: {
    marginBottom: spacing.md,
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bigAvatarBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.canvasSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.ink,
    borderWidth: 2,
  },
  bigAvatarText: {
    fontSize: 42,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.canvas,
    borderColor: colors.hairline,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.xxs,
  },
  avatarBubbleSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
    transform: [{ scale: 1.1 }],
  },
  avatarText: {
    fontSize: 24,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
});
