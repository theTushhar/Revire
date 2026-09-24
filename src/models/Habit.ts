import Realm, { ObjectSchema } from 'realm';

export type HabitScheduleType = 'daily' | 'custom';
export type HabitStatus = 'active' | 'paused' | 'completed';

export class HabitCompletion extends Realm.Object<HabitCompletion> {
  date!: string; // ISO date 'yyyy-MM-dd'
  completedAt!: Date;

  static schema: ObjectSchema = {
    name: 'HabitCompletion',
    embedded: true,
    properties: {
      date: 'string',
      completedAt: { type: 'date', default: () => new Date() },
    },
  };
}

export class Habit extends Realm.Object<Habit> {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  icon!: string;
  category!: string;
  scheduleType!: string; // HabitScheduleType
  activeDays!: Realm.List<number>; // 0=Sun..6=Sat, only meaningful when scheduleType === 'custom'
  targetLabel!: string; // free-text display, e.g. "45 MINS", "2.5 LITERS"
  status!: string; // HabitStatus
  completions!: Realm.List<HabitCompletion>;
  currentStreak!: number;
  longestStreak!: number;
  createdAt!: Date;
  updatedAt!: Date;

  static primaryKey = '_id';
  static schema: ObjectSchema = {
    name: 'Habit',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string',
      icon: { type: 'string', default: 'check-circle-outline' },
      category: { type: 'string', default: 'General' },
      scheduleType: { type: 'string', default: 'daily' },
      activeDays: { type: 'list', objectType: 'int' },
      targetLabel: { type: 'string', default: 'DAILY' },
      status: { type: 'string', default: 'active' },
      completions: { type: 'list', objectType: 'HabitCompletion' },
      currentStreak: { type: 'int', default: 0 },
      longestStreak: { type: 'int', default: 0 },
      createdAt: { type: 'date', default: () => new Date() },
      updatedAt: { type: 'date', default: () => new Date() },
    },
  };
}
