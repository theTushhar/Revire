import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { hapticUtils } from '../hapticUtils';

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));

describe('hapticUtils', () => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hapticUtils.enabled = true;
  });

  afterEach(() => {
    hapticUtils.enabled = true;
  });

  describe('when enabled is true', () => {
    it('light() triggers impactLight', () => {
      hapticUtils.light();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactLight', options);
    });

    it('medium() triggers impactMedium', () => {
      hapticUtils.medium();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactMedium', options);
    });

    it('heavy() triggers impactHeavy', () => {
      hapticUtils.heavy();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('impactHeavy', options);
    });

    it('selection() triggers selection', () => {
      hapticUtils.selection();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('selection', options);
    });

    it('success() triggers notificationSuccess', () => {
      hapticUtils.success();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationSuccess', options);
    });

    it('warning() triggers notificationWarning', () => {
      hapticUtils.warning();
      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith('notificationWarning', options);
    });
  });

  describe('when enabled is false', () => {
    beforeEach(() => {
      hapticUtils.enabled = false;
    });

    it('does not trigger haptic feedback', () => {
      hapticUtils.light();
      hapticUtils.medium();
      hapticUtils.heavy();
      hapticUtils.selection();
      hapticUtils.success();
      hapticUtils.warning();

      expect(ReactNativeHapticFeedback.trigger).not.toHaveBeenCalled();
    });
  });
});
