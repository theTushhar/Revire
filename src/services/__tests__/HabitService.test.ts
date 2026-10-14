import Realm from 'realm';
import { HabitService, HabitInput } from '../HabitService';
import { Habit, HabitCompletion } from '../../models/Habit';

describe('HabitService', () => {
  let realm: Realm;

  beforeEach(() => {
    realm = new Realm({
      schema: [Habit, HabitCompletion],
      inMemory: true,
      path: `test-${Date.now()}-${Math.random()}.realm`,
    });
  });

  afterEach(() => {
    if (!realm.isClosed) {
      realm.close();
    }
  });

  describe('CRUD operations', () => {
    it('adds a new habit', () => {
      const input: HabitInput = {
        name: 'Drink Water',
        icon: 'water',
        category: 'Health',
        scheduleType: 'daily',
        activeDays: [],
        targetLabel: '2L',
      };

      const habit = HabitService.add(realm, input);

      expect(habit).toBeDefined();
      expect(habit.name).toBe('Drink Water');
      expect(habit.status).toBe('active');
      expect(habit.currentStreak).toBe(0);

      const allHabits = HabitService.getAll(realm);
      expect(allHabits.length).toBe(1);
    });

    it('gets habit by id', () => {
      const habit = HabitService.add(realm, {
        name: 'Read',
        icon: 'book',
        category: 'Learning',
        scheduleType: 'daily',
        activeDays: [],
        targetLabel: '30m',
      });

      const found = HabitService.getById(realm, habit._id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Read');
    });

    it('updates habit', () => {
      const habit = HabitService.add(realm, {
        name: 'Run',
        icon: 'run',
        category: 'Fitness',
        scheduleType: 'daily',
        activeDays: [],
        targetLabel: '5km',
      });

      HabitService.update(realm, habit, { name: 'Jogging', targetLabel: '3km' });

      expect(habit.name).toBe('Jogging');
      expect(habit.targetLabel).toBe('3km');
      // Other fields remain unchanged
      expect(habit.icon).toBe('run');
    });

    it('sets habit status', () => {
      const habit = HabitService.add(realm, {
        name: 'Meditate',
        icon: 'brain',
        category: 'Mindfulness',
        scheduleType: 'daily',
        activeDays: [],
        targetLabel: '10m',
      });

      HabitService.setStatus(realm, habit, 'paused');
      expect(habit.status).toBe('paused');
    });

    it('deletes habit', () => {
      const habit = HabitService.add(realm, {
        name: 'Stretch',
        icon: 'yoga',
        category: 'Fitness',
        scheduleType: 'daily',
        activeDays: [],
        targetLabel: '15m',
      });

      expect(HabitService.getAll(realm).length).toBe(1);
      HabitService.delete(realm, habit);
      expect(HabitService.getAll(realm).length).toBe(0);
    });
  });

  describe('isScheduledOn', () => {
    let dailyHabit: Habit;
    let customHabit: Habit;

    beforeEach(() => {
      dailyHabit = HabitService.add(realm, {
        name: 'Daily',
        icon: 'test',
        category: 'test',
        scheduleType: 'daily',
        activeDays: [],
        targetLabel: '',
      });

      customHabit = HabitService.add(realm, {
        name: 'Custom (Mon, Wed, Fri)',
        icon: 'test',
        category: 'test',
        scheduleType: 'custom',
        activeDays: [1, 3, 5], // Mon, Wed, Fri
        targetLabel: '',
      });

      // Override created at so we can test scheduling on older dates
      realm.write(() => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10);
        dailyHabit.createdAt = pastDate;
        customHabit.createdAt = pastDate;
      });
    });

    it('returns true for daily habit on any valid date after creation', () => {
      expect(HabitService.isScheduledOn(dailyHabit, new Date())).toBe(true);
    });

    it('returns false for dates before creation', () => {
      const beforeCreation = new Date();
      beforeCreation.setDate(beforeCreation.getDate() - 20); // 20 days ago, before createdAt
      expect(HabitService.isScheduledOn(dailyHabit, beforeCreation)).toBe(false);
    });

    it('returns true for custom habit only on active days', () => {
      // Find a Monday (1)
      const monday = new Date();
      while (monday.getDay() !== 1) {
        monday.setDate(monday.getDate() + 1);
      }
      expect(HabitService.isScheduledOn(customHabit, monday)).toBe(true);

      // Find a Tuesday (2)
      const tuesday = new Date(monday);
      tuesday.setDate(monday.getDate() + 1);
      expect(HabitService.isScheduledOn(customHabit, tuesday)).toBe(false);
    });
  });

  describe('completion toggling', () => {
    let habit: Habit;

    beforeEach(() => {
      habit = HabitService.add(realm, {
        name: 'Test',
        icon: 'test',
        category: 'test',
        scheduleType: 'daily',
        activeDays: [],
        targetLabel: '',
      });
    });

    it('toggles today completion', () => {
      expect(HabitService.isCompletedToday(habit)).toBe(false);
      expect(habit.completions.length).toBe(0);

      // Toggle ON
      HabitService.toggleToday(realm, habit);
      expect(HabitService.isCompletedToday(habit)).toBe(true);
      expect(habit.completions.length).toBe(1);
      expect(habit.currentStreak).toBe(1);
      expect(habit.longestStreak).toBe(1);

      // Toggle OFF
      HabitService.toggleToday(realm, habit);
      expect(HabitService.isCompletedToday(habit)).toBe(false);
      expect(habit.completions.length).toBe(0);
      expect(habit.currentStreak).toBe(0);
    });
  });
});
