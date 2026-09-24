import { Habit } from '../models/Habit';
import { HabitService } from './HabitService';
import { dateUtils } from '../utils/dateUtils';

export interface DailyProgress {
  scheduled: number;
  completed: number;
  ratio: number;
}

export interface CategoryRate {
  category: string;
  rate: number;
}

export interface ActivityEntry {
  habitId: string;
  habitName: string;
  icon: string;
  date: string;
  completedAt: Date;
}

export interface Achievement {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
}

const LOOKBACK_DAYS = 30;

export const InsightsService = {
  progressOn(habits: Habit[], date: Date): DailyProgress {
    const scheduledHabits = habits.filter((h) => h.status === 'active' && HabitService.isScheduledOn(h, date));
    const isoDate = dateUtils.isoDate(date);
    const completed = scheduledHabits.filter((h) => HabitService.isCompletedOn(h, isoDate)).length;
    return {
      scheduled: scheduledHabits.length,
      completed,
      ratio: scheduledHabits.length > 0 ? completed / scheduledHabits.length : 0,
    };
  },

  weekBoolArray(habit: Habit, days = 7): boolean[] {
    return dateUtils.lastNDays(days).map((d) => HabitService.isCompletedOn(habit, dateUtils.isoDate(d)));
  },

  heatmapValues(habits: Habit[], days = 182): number[] {
    return dateUtils.lastNDays(days).map((d) => this.progressOn(habits, d).ratio);
  },

  categorySuccessRates(habits: Habit[]): CategoryRate[] {
    const categories = Array.from(new Set(habits.map((h) => h.category)));
    const window = dateUtils.lastNDays(LOOKBACK_DAYS);

    return categories
      .map((category) => {
        const categoryHabits = habits.filter((h) => h.category === category && h.status === 'active');
        let scheduled = 0;
        let completed = 0;
        for (const day of window) {
          for (const habit of categoryHabits) {
            if (!HabitService.isScheduledOn(habit, day)) continue;
            scheduled++;
            if (HabitService.isCompletedOn(habit, dateUtils.isoDate(day))) completed++;
          }
        }
        return { category, rate: scheduled > 0 ? completed / scheduled : 0 };
      })
      .filter((c) => c.rate > 0 || habits.some((h) => h.category === c.category))
      .sort((a, b) => b.rate - a.rate);
  },

  bestStreak(habits: Habit[]): number {
    return habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
  },

  overallCompletionRate(habits: Habit[], days = LOOKBACK_DAYS): number {
    const window = dateUtils.lastNDays(days);
    let scheduled = 0;
    let completed = 0;
    for (const day of window) {
      const p = this.progressOn(habits, day);
      scheduled += p.scheduled;
      completed += p.completed;
    }
    return scheduled > 0 ? completed / scheduled : 0;
  },

  // Weekly total-completions trend, used as a proxy for "streak growth" momentum
  // since we don't store historical streak snapshots — just completion events.
  weeklyCompletionTrend(habits: Habit[], weeks = 12): number[] {
    const totals: number[] = [];
    const today = dateUtils.dayOnly(new Date());
    for (let w = weeks - 1; w >= 0; w--) {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - w * 7);
      const weekDays = dateUtils.lastNDays(7, weekEnd);
      let count = 0;
      for (const day of weekDays) {
        count += this.progressOn(habits, day).completed;
      }
      totals.push(count);
    }
    return totals;
  },

  mostConsistentHour(habits: Habit[]): number | null {
    const counts = new Array(24).fill(0);
    let total = 0;
    for (const habit of habits) {
      for (const c of habit.completions) {
        counts[c.completedAt.getHours()]++;
        total++;
      }
    }
    if (total === 0) return null;
    let bestHour = 0;
    for (let h = 1; h < 24; h++) {
      if (counts[h] > counts[bestHour]) bestHour = h;
    }
    return bestHour;
  },

  recentActivity(habits: Habit[], limit = 10): ActivityEntry[] {
    const entries: ActivityEntry[] = [];
    for (const habit of habits) {
      for (const c of habit.completions) {
        entries.push({
          habitId: habit._id.toHexString(),
          habitName: habit.name,
          icon: habit.icon,
          date: c.date,
          completedAt: c.completedAt,
        });
      }
    }
    return entries.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime()).slice(0, limit);
  },

  totalCompletions(habits: Habit[]): number {
    return habits.reduce((sum, h) => sum + h.completions.length, 0);
  },

  xpPoints(habits: Habit[]): number {
    return this.totalCompletions(habits) * 10 + this.bestStreak(habits) * 5;
  },

  achievements(habits: Habit[]): Achievement[] {
    const totalCompletions = this.totalCompletions(habits);
    const bestStreak = this.bestStreak(habits);
    const completionRate = this.overallCompletionRate(habits);
    const hasEarlyCompletion = habits.some((h) => h.completions.some((c) => c.completedAt.getHours() < 7));

    return [
      { id: 'early-riser', label: 'Early Riser', icon: 'weather-sunset-up', unlocked: hasEarlyCompletion },
      { id: 'on-fire', label: 'On Fire', icon: 'fire', unlocked: habits.some((h) => h.currentStreak >= 7) },
      { id: 'disciplined', label: 'Disciplined', icon: 'medal-outline', unlocked: completionRate >= 0.8 },
      { id: 'elite', label: 'Elite', icon: 'shield-star-outline', unlocked: bestStreak >= 30 },
      { id: 'zen-master', label: 'Zen Master', icon: 'creation', unlocked: totalCompletions >= 100 },
    ];
  },
};
