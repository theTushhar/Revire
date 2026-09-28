/// <reference types="jest" />
import { dateUtils } from '../dateUtils';

describe('dateUtils', () => {
  const FIXED_SYSTEM_TIME = new Date('2024-05-15T12:00:00Z').getTime();

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_SYSTEM_TIME);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('isoDate', () => {
    it('formats a date to yyyy-MM-dd', () => {
      const date = new Date(2024, 0, 5); // Jan 5, 2024
      expect(dateUtils.isoDate(date)).toBe('2024-01-05');
    });
  });

  describe('todayIso', () => {
    it('returns today ISO date key', () => {
      // Because system time is mocked to May 15, 2024
      const today = new Date();
      const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(dateUtils.todayIso()).toBe(expected);
    });
  });

  describe('dayOnly', () => {
    it('strips the time component from a date', () => {
      const date = new Date(2024, 4, 15, 14, 30, 45); // May 15, 2024, 14:30:45
      const stripped = dateUtils.dayOnly(date);
      expect(stripped.getFullYear()).toBe(2024);
      expect(stripped.getMonth()).toBe(4);
      expect(stripped.getDate()).toBe(15);
      expect(stripped.getHours()).toBe(0);
      expect(stripped.getMinutes()).toBe(0);
      expect(stripped.getSeconds()).toBe(0);
      expect(stripped.getMilliseconds()).toBe(0);
    });
  });

  describe('isSameDay', () => {
    it('returns true if two dates are on the same calendar day', () => {
      const date1 = new Date(2024, 4, 15, 14, 30);
      const date2 = new Date(2024, 4, 15, 23, 59);
      expect(dateUtils.isSameDay(date1, date2)).toBe(true);
    });

    it('returns false if two dates are on different calendar days', () => {
      const date1 = new Date(2024, 4, 15, 23, 59);
      const date2 = new Date(2024, 4, 16, 0, 1);
      expect(dateUtils.isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('returns true if date is today', () => {
      expect(dateUtils.isToday(new Date())).toBe(true);
    });

    it('returns false if date is not today', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(dateUtils.isToday(yesterday)).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('calculates the whole days between two dates', () => {
      const from = new Date(2024, 4, 10, 23, 59);
      const to = new Date(2024, 4, 15, 0, 1);
      expect(dateUtils.daysBetween(from, to)).toBe(5);
    });

    it('handles negative differences', () => {
      const from = new Date(2024, 4, 15);
      const to = new Date(2024, 4, 10);
      expect(dateUtils.daysBetween(from, to)).toBe(-5);
    });
  });

  describe('compactDuration', () => {
    it('formats duration in days and hours', () => {
      const ms = (2 * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000); // 2 days, 5 hours
      expect(dateUtils.compactDuration(ms)).toBe('2d 5h');
    });

    it('formats duration in hours and minutes', () => {
      const ms = (5 * 60 * 60 * 1000) + (30 * 60 * 1000); // 5 hours, 30 minutes
      expect(dateUtils.compactDuration(ms)).toBe('5h 30m');
    });

    it('formats duration in minutes', () => {
      const ms = 45 * 60 * 1000; // 45 minutes
      expect(dateUtils.compactDuration(ms)).toBe('45m');
    });

    it('returns at least 1m for small durations', () => {
      const ms = 30 * 1000; // 30 seconds
      expect(dateUtils.compactDuration(ms)).toBe('1m');
    });
  });

  describe('friendlyDate', () => {
    it('returns "Today" for today', () => {
      expect(dateUtils.friendlyDate(new Date())).toBe('Today');
    });

    it('returns "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(dateUtils.friendlyDate(yesterday)).toBe('Yesterday');
    });

    it('returns "Tomorrow" for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(dateUtils.friendlyDate(tomorrow)).toBe('Tomorrow');
    });

    it('returns formatted date for other days', () => {
      const pastDate = new Date(2024, 0, 5); // Jan 5, 2024
      // Mocked time is May 15, 2024, so Jan 5 is not today, yesterday, or tomorrow.
      expect(dateUtils.friendlyDate(pastDate)).toBe('Fri, Jan 5');
    });
  });

  describe('timeOfDay', () => {
    it('formats date as h:mm a', () => {
      const date = new Date(2024, 4, 15, 14, 30);
      expect(dateUtils.timeOfDay(date)).toBe('2:30 PM');
    });
  });

  describe('monthYear', () => {
    it('formats date as MMMM yyyy', () => {
      const date = new Date(2024, 4, 15);
      expect(dateUtils.monthYear(date)).toBe('May 2024');
    });
  });

  describe('parseHm', () => {
    it('parses valid HH:mm', () => {
      expect(dateUtils.parseHm('14:30')).toEqual({ hour: 14, minute: 30 });
      expect(dateUtils.parseHm('09:05')).toEqual({ hour: 9, minute: 5 });
    });

    it('returns 0,0 on invalid input', () => {
      expect(dateUtils.parseHm('invalid')).toEqual({ hour: 0, minute: 0 });
      expect(dateUtils.parseHm('14:xx')).toEqual({ hour: 0, minute: 0 });
      expect(dateUtils.parseHm('')).toEqual({ hour: 0, minute: 0 });
    });
  });

  describe('formatHm', () => {
    it('formats hour and minute to HH:mm', () => {
      expect(dateUtils.formatHm(14, 30)).toBe('14:30');
      expect(dateUtils.formatHm(9, 5)).toBe('09:05');
      expect(dateUtils.formatHm(0, 0)).toBe('00:00');
    });
  });

  describe('startOfWeek', () => {
    it('returns the Monday of the current week', () => {
      const wednesday = new Date(2024, 4, 15); // May 15, 2024 (Wednesday)
      const monday = dateUtils.startOfWeek(wednesday);
      expect(monday.getFullYear()).toBe(2024);
      expect(monday.getMonth()).toBe(4);
      expect(monday.getDate()).toBe(13); // May 13, 2024 (Monday)
      expect(monday.getHours()).toBe(0);
    });
  });

  describe('weekDays', () => {
    it('returns an array of 7 days starting from Monday', () => {
      const wednesday = new Date(2024, 4, 15); // May 15, 2024
      const days = dateUtils.weekDays(wednesday);

      expect(days.length).toBe(7);
      expect(days[0].getDate()).toBe(13); // Mon
      expect(days[6].getDate()).toBe(19); // Sun
    });
  });

  describe('lastNDays', () => {
    it('returns the last N days ending today by default', () => {
      const days = dateUtils.lastNDays(3);
      expect(days.length).toBe(3);

      const today = new Date();
      expect(dateUtils.isSameDay(days[2], today)).toBe(true);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(dateUtils.isSameDay(days[1], yesterday)).toBe(true);

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      expect(dateUtils.isSameDay(days[0], twoDaysAgo)).toBe(true);
    });

    it('returns the last N days ending on a specific date', () => {
      const end = new Date(2024, 4, 15);
      const days = dateUtils.lastNDays(3, end);
      expect(days.length).toBe(3);
      expect(days[2].getDate()).toBe(15);
      expect(days[1].getDate()).toBe(14);
      expect(days[0].getDate()).toBe(13);
    });
  });
});
