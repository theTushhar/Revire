import { differenceInDays, parseISO } from 'date-fns';
import { dateUtils } from './dateUtils';

export const streakCalculator = {
  /**
   * Current clean streak in whole days since startDate (or the last relapse,
   * whichever is later). Never negative.
   */
  currentStreakDays(startDate: Date, lastRelapseDate?: Date): number {
    const anchor = this.laterOf(startDate, lastRelapseDate);
    const days = differenceInDays(dateUtils.dayOnly(new Date()), dateUtils.dayOnly(anchor));
    return days < 0 ? 0 : days;
  },

  /**
   * Live elapsed duration since the streak anchor — drives the ticking timer.
   * Returns difference in milliseconds.
   */
  elapsedSince(startDate: Date, lastRelapseDate?: Date): number {
    const anchor = this.laterOf(startDate, lastRelapseDate);
    const diff = Date.now() - anchor.getTime();
    return diff < 0 ? 0 : diff;
  },

  /**
   * Longest run of consecutive completed days from a set of ISO date strings.
   * Used for habit "best streak".
   */
  longestStreakFromDates(isoDates: string[]): number {
    if (isoDates.length === 0) return 0;

    // Parse, get dayOnly, unique, sort
    const dates = Array.from(
      new Set(isoDates.map((d) => dateUtils.dayOnly(parseISO(d)).getTime())),
    ).sort((a, b) => a - b);

    let best = 1;
    let run = 1;

    for (let i = 1; i < dates.length; i++) {
      const gap = Math.round((dates[i] - dates[i - 1]) / 86400000);
      if (gap === 1) {
        run++;
        if (run > best) best = run;
      } else if (gap > 1) {
        run = 1;
      }
    }

    return best;
  },

  /**
   * Current run of consecutive completed days ending today (or yesterday, so a
   * streak isn't "broken" until a full day is missed). For habit flames.
   */
  currentStreakFromDates(isoDates: string[]): number {
    if (isoDates.length === 0) return 0;

    const set = new Set(isoDates.map((s) => dateUtils.dayOnly(parseISO(s)).getTime()));

    let cursor = dateUtils.dayOnly(new Date());
    // Allow the streak to still count if today isn't done yet but yesterday was.
    if (!set.has(cursor.getTime())) {
      cursor.setDate(cursor.getDate() - 1);
      if (!set.has(cursor.getTime())) return 0;
    }

    let streak = 0;
    while (set.has(cursor.getTime())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  },

  /**
   * Which milestones (from the canonical list) a streak of [days] has reached.
   */
  reachedMilestones(days: number, milestones: number[]): number[] {
    return milestones.filter((m) => days >= m);
  },

  /**
   * The next milestone above [days], or null if all are reached.
   */
  nextMilestone(days: number, milestones: number[]): number | null {
    for (const m of milestones) {
      if (days < m) return m;
    }
    return null;
  },

  laterOf(a: Date, b?: Date): Date {
    if (!b) return a;
    return b.getTime() > a.getTime() ? b : a;
  },
};
