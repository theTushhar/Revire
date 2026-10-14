/// <reference types="jest" />
import { streakCalculator } from '../streakCalculator';
import { subDays, format } from 'date-fns';

describe('streakCalculator', () => {
  describe('currentStreakDays', () => {
    it('returns 0 if start date is in the future', () => {
      const future = new Date(Date.now() + 86400000);
      expect(streakCalculator.currentStreakDays(future)).toBe(0);
    });

    it('calculates days clean since start date with no relapse', () => {
      const start = subDays(new Date(), 5);
      expect(streakCalculator.currentStreakDays(start)).toBe(5);
    });

    it('calculates days clean since last relapse date if later than start date', () => {
      const start = subDays(new Date(), 10);
      const relapse = subDays(new Date(), 3);
      expect(streakCalculator.currentStreakDays(start, relapse)).toBe(3);
    });
  });

  describe('longestStreakFromDates', () => {
    it('returns 0 for empty list', () => {
      expect(streakCalculator.longestStreakFromDates([])).toBe(0);
    });

    it('calculates longest consecutive days correctly', () => {
      const today = new Date();
      const formatIso = (d: Date) => format(d, 'yyyy-MM-dd');

      const dates = [
        formatIso(subDays(today, 10)),
        formatIso(subDays(today, 9)),
        formatIso(subDays(today, 8)),
        // gap of 1 day
        formatIso(subDays(today, 6)),
        formatIso(subDays(today, 5)),
        formatIso(subDays(today, 4)),
        formatIso(subDays(today, 3)),
        // gap
        formatIso(subDays(today, 1)),
      ];

      expect(streakCalculator.longestStreakFromDates(dates)).toBe(4); // 6,5,4,3 is length 4
    });
  });

  describe('currentStreakFromDates', () => {
    it('returns 0 if no completed dates recently', () => {
      const today = new Date();
      const formatIso = (d: Date) => format(d, 'yyyy-MM-dd');
      const dates = [formatIso(subDays(today, 5))];
      expect(streakCalculator.currentStreakFromDates(dates)).toBe(0);
    });

    it('calculates current streak including today', () => {
      const today = new Date();
      const formatIso = (d: Date) => format(d, 'yyyy-MM-dd');
      const dates = [formatIso(today), formatIso(subDays(today, 1)), formatIso(subDays(today, 2))];
      expect(streakCalculator.currentStreakFromDates(dates)).toBe(3);
    });

    it('calculates current streak including yesterday (today not complete yet)', () => {
      const today = new Date();
      const formatIso = (d: Date) => format(d, 'yyyy-MM-dd');
      const dates = [formatIso(subDays(today, 1)), formatIso(subDays(today, 2))];
      expect(streakCalculator.currentStreakFromDates(dates)).toBe(2);
    });
  });
});
