import { format, differenceInDays, startOfWeek as dfStartOfWeek, addDays } from 'date-fns';

export const dateUtils = {
  /**
   * ISO date key `yyyy-MM-dd` — used as map keys and for DailyCheckinModel.date.
   */
  isoDate(d: Date): string {
    return format(d, 'yyyy-MM-dd');
  },

  /**
   * Today's ISO date key.
   */
  todayIso(): string {
    return this.isoDate(new Date());
  },

  /**
   * Strip the time component so two Dates on the same calendar day compare equal.
   */
  dayOnly(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  },

  isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  },

  isToday(d: Date): boolean {
    return this.isSameDay(d, new Date());
  },

  /**
   * Whole days between two dates, ignoring time-of-day.
   */
  daysBetween(from: Date, to: Date): number {
    return differenceInDays(this.dayOnly(to), this.dayOnly(from));
  },

  /**
   * "3d 4h 12m" style compact duration for streak sub-labels.
   * Expects duration in milliseconds.
   */
  compactDuration(ms: number): string {
    const totalMinutes = Math.floor(ms / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    if (days > 0) {
      return `${days}d ${totalHours % 24}h`;
    }
    if (totalHours > 0) {
      return `${totalHours}h ${totalMinutes % 60}m`;
    }
    return `${Math.max(1, totalMinutes)}m`;
  },

  /**
   * Friendly label: Today / Yesterday / Tomorrow / Mon, Jan 5.
   */
  friendlyDate(d: Date): string {
    const now = new Date();
    if (this.isSameDay(d, now)) return 'Today';

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (this.isSameDay(d, yesterday)) return 'Yesterday';

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (this.isSameDay(d, tomorrow)) return 'Tomorrow';

    return format(d, 'EEE, MMM d');
  },

  timeOfDay(d: Date): string {
    return format(d, 'h:mm a');
  },

  monthYear(d: Date): string {
    return format(d, 'MMMM yyyy');
  },

  /**
   * Parse "HH:mm" (24h) into (hour, minute). Returns (0,0) on bad input.
   */
  parseHm(hm: string): { hour: number; minute: number } {
    try {
      const parts = hm.split(':');
      const hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);
      if (isNaN(hour) || isNaN(minute)) throw new Error('Invalid Hm');
      return { hour, minute };
    } catch {
      return { hour: 0, minute: 0 };
    }
  },

  /**
   * Format (hour, minute) as "HH:mm".
   */
  formatHm(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  },

  /**
   * The Monday that begins the ISO week containing [d].
   */
  startOfWeek(d: Date): Date {
    return dfStartOfWeek(this.dayOnly(d), { weekStartsOn: 1 });
  },

  /**
   * The 7 days (Mon..Sun) of the week containing [d].
   */
  weekDays(d: Date): Date[] {
    const start = this.startOfWeek(d);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  },

  weekdayLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],

  /**
   * The last [n] days ending today (oldest first) — used for week bar charts / heatmaps.
   */
  lastNDays(n: number, end: Date = new Date()): Date[] {
    const endDay = this.dayOnly(end);
    return Array.from({ length: n }, (_, i) => addDays(endDay, i - (n - 1)));
  },
};
