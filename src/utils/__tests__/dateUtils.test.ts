import { dateUtils } from '../dateUtils';

describe('dateUtils', () => {
  describe('isoDate', () => {
    it('returns yyyy-MM-dd formatted date', () => {
      const date = new Date(2023, 9, 15); // October 15, 2023
      expect(dateUtils.isoDate(date)).toBe('2023-10-15');
    });
  });

  describe('todayIso', () => {
    it('returns current date in iso format', () => {
      const today = new Date();
      const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(dateUtils.todayIso()).toBe(expected);
    });
  });

  describe('dayOnly', () => {
    it('strips time component from date', () => {
      const date = new Date(2023, 9, 15, 14, 30, 45, 500);
      const dayOnly = dateUtils.dayOnly(date);
      expect(dayOnly.getFullYear()).toBe(2023);
      expect(dayOnly.getMonth()).toBe(9);
      expect(dayOnly.getDate()).toBe(15);
      expect(dayOnly.getHours()).toBe(0);
      expect(dayOnly.getMinutes()).toBe(0);
      expect(dayOnly.getSeconds()).toBe(0);
      expect(dayOnly.getMilliseconds()).toBe(0);
    });
  });

  describe('isSameDay', () => {
    it('returns true for same day regardless of time', () => {
      const date1 = new Date(2023, 9, 15, 14, 30);
      const date2 = new Date(2023, 9, 15, 18, 45);
      expect(dateUtils.isSameDay(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = new Date(2023, 9, 15, 14, 30);
      const date2 = new Date(2023, 9, 16, 14, 30);
      expect(dateUtils.isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('calculates whole days ignoring time', () => {
      const from = new Date(2023, 9, 15, 23, 59);
      const to = new Date(2023, 9, 17, 0, 1);
      expect(dateUtils.daysBetween(from, to)).toBe(2);
    });
  });

  describe('compactDuration', () => {
    it('formats minutes', () => {
      expect(dateUtils.compactDuration(45 * 60000)).toBe('45m');
    });

    it('formats less than 1 minute as 1m', () => {
      expect(dateUtils.compactDuration(30000)).toBe('1m');
    });

    it('formats hours and minutes', () => {
      expect(dateUtils.compactDuration((2 * 60 + 30) * 60000)).toBe('2h 30m');
    });

    it('formats days and hours', () => {
      expect(dateUtils.compactDuration((2 * 24 * 60 + 5 * 60 + 30) * 60000)).toBe('2d 5h');
    });
  });

  describe('parseHm', () => {
    it('parses valid HH:mm', () => {
      expect(dateUtils.parseHm('14:30')).toEqual({ hour: 14, minute: 30 });
      expect(dateUtils.parseHm('09:05')).toEqual({ hour: 9, minute: 5 });
    });

    it('returns 0,0 for invalid input', () => {
      expect(dateUtils.parseHm('invalid')).toEqual({ hour: 0, minute: 0 });
      expect(dateUtils.parseHm('14')).toEqual({ hour: 0, minute: 0 });
      expect(dateUtils.parseHm('')).toEqual({ hour: 0, minute: 0 });
    });
  });

  describe('formatHm', () => {
    it('formats valid hour and minute with padding', () => {
      expect(dateUtils.formatHm(14, 30)).toBe('14:30');
      expect(dateUtils.formatHm(9, 5)).toBe('09:05');
      expect(dateUtils.formatHm(0, 0)).toBe('00:00');
    });
  });
});
