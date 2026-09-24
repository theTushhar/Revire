import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const hapticUtils = {
  enabled: true,

  light(): void {
    if (this.enabled) {
      ReactNativeHapticFeedback.trigger('impactLight', options);
    }
  },

  medium(): void {
    if (this.enabled) {
      ReactNativeHapticFeedback.trigger('impactMedium', options);
    }
  },

  heavy(): void {
    if (this.enabled) {
      ReactNativeHapticFeedback.trigger('impactHeavy', options);
    }
  },

  selection(): void {
    if (this.enabled) {
      ReactNativeHapticFeedback.trigger('selection', options);
    }
  },

  /**
   * Positive confirmation (e.g. logging an urge survived, completing a habit).
   */
  success(): void {
    if (this.enabled) {
      ReactNativeHapticFeedback.trigger('notificationSuccess', options);
    }
  },

  /**
   * Attention-grabbing (e.g. relapse confirm, panic button).
   */
  warning(): void {
    if (this.enabled) {
      ReactNativeHapticFeedback.trigger('notificationWarning', options);
    }
  },
};
