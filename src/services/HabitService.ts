import Realm from 'realm';
import { Habit, HabitCompletion, HabitScheduleType, HabitStatus } from '../models/Habit';
import { dateUtils } from '../utils/dateUtils';
import { streakCalculator } from '../utils/streakCalculator';

export interface HabitInput {
  name: string;
  icon: string;
  category: string;
  scheduleType: HabitScheduleType;
  activeDays: number[];
  targetLabel: string;
}

function toObjectId(id: string | Realm.BSON.ObjectId): Realm.BSON.ObjectId {
  return typeof id === 'string' ? new Realm.BSON.ObjectId(id) : id;
}

export const HabitService = {
  getAll(realm: Realm) {
    return realm.objects(Habit).sorted('createdAt');
  },

  getById(realm: Realm, id: string | Realm.BSON.ObjectId): Habit | null {
    return realm.objectForPrimaryKey(Habit, toObjectId(id));
  },

  add(realm: Realm, input: HabitInput): Habit {
    let created!: Habit;
    realm.write(() => {
      created = realm.create(Habit, {
        _id: new Realm.BSON.ObjectId(),
        name: input.name,
        icon: input.icon,
        category: input.category,
        scheduleType: input.scheduleType,
        activeDays: input.activeDays,
        targetLabel: input.targetLabel,
        status: 'active',
        completions: [],
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    return created;
  },

  update(realm: Realm, habit: Habit, data: Partial<HabitInput>) {
    realm.write(() => {
      if (data.name !== undefined) habit.name = data.name;
      if (data.icon !== undefined) habit.icon = data.icon;
      if (data.category !== undefined) habit.category = data.category;
      if (data.scheduleType !== undefined) habit.scheduleType = data.scheduleType;
      if (data.activeDays !== undefined)
        habit.activeDays = data.activeDays as unknown as Realm.List<number>;
      if (data.targetLabel !== undefined) habit.targetLabel = data.targetLabel;
      habit.updatedAt = new Date();
    });
  },

  setStatus(realm: Realm, habit: Habit, status: HabitStatus) {
    realm.write(() => {
      habit.status = status;
      habit.updatedAt = new Date();
    });
  },

  delete(realm: Realm, habit: Habit) {
    realm.write(() => {
      realm.delete(habit);
    });
  },

  isScheduledOn(habit: Habit, date: Date): boolean {
    if (dateUtils.dayOnly(date) < dateUtils.dayOnly(habit.createdAt)) return false;
    if (habit.scheduleType === 'daily') return true;
    const targetDay = date.getDay();
    for (let i = 0; i < habit.activeDays.length; i++) {
      if (habit.activeDays[i] === targetDay) return true;
    }
    return false;
  },

  isCompletedOn(habit: Habit, isoDate: string): boolean {
    return Array.from(habit.completions).some((c) => c.date === isoDate);
  },

  isCompletedToday(habit: Habit): boolean {
    return this.isCompletedOn(habit, dateUtils.todayIso());
  },

  toggleToday(realm: Realm, habit: Habit) {
    const today = dateUtils.todayIso();
    realm.write(() => {
      let existingIndex = -1;
      for (let i = 0; i < habit.completions.length; i++) {
        if (habit.completions[i].date === today) {
          existingIndex = i;
          break;
        }
      }
      if (existingIndex >= 0) {
        habit.completions.splice(existingIndex, 1);
      } else {
        habit.completions.push({
          date: today,
          completedAt: new Date(),
        } as unknown as HabitCompletion);
      }
      habit.updatedAt = new Date();

      const dates = Array.from(habit.completions).map((c) => c.date);
      habit.currentStreak = streakCalculator.currentStreakFromDates(dates);
      habit.longestStreak = Math.max(
        habit.longestStreak,
        streakCalculator.longestStreakFromDates(dates),
      );
    });
  },
};
