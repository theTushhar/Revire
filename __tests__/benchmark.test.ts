import Realm from 'realm';
import { Habit, HabitCompletion } from '../src/models/Habit';
import { HabitService } from '../src/services/HabitService';
import { dateUtils } from '../src/utils/dateUtils';

describe('HabitService Benchmark', () => {
  let realm: Realm;
  let habit: Habit;
  const testIsoDate = dateUtils.todayIso();
  const testDate = new Date();

  beforeAll(async () => {
    realm = await Realm.open({
      schema: [Habit, HabitCompletion],
      inMemory: true,
      path: 'benchmark.realm',
    });

    realm.write(() => {
      realm.deleteAll();
    });

    const activeDays = [0, 1, 2, 3, 4, 5, 6];
    const completions: { date: string; completedAt: Date }[] = [];

    const baseDate = new Date();
    for (let i = 0; i < 1000; i++) {
      const d = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
      completions.push({
        date: d.toISOString().split('T')[0],
        completedAt: d,
      });
    }

    realm.write(() => {
      habit = realm.create(Habit, {
        _id: new Realm.BSON.ObjectId(),
        name: 'Benchmark Habit',
        icon: 'star',
        category: 'fitness',
        scheduleType: 'specific_days',
        activeDays,
        targetLabel: 'times',
        status: 'active',
        completions,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  afterAll(() => {
    if (realm) {
      realm.close();
      Realm.deleteFile({ path: 'benchmark.realm' });
    }
  });

  it('benchmark', () => {
    const iterations = 1000;

    // Warmup
    for (let i = 0; i < 100; i++) {
      HabitService.isScheduledOn(habit, testDate);
      HabitService.isCompletedOn(habit, testIsoDate);
    }

    const startScheduled = performance.now();
    for (let i = 0; i < iterations; i++) {
      HabitService.isScheduledOn(habit, testDate);
    }
    const endScheduled = performance.now();
    const scheduledTimeMs = endScheduled - startScheduled;

    const startCompleted = performance.now();
    for (let i = 0; i < iterations; i++) {
      HabitService.isCompletedOn(habit, testIsoDate);
    }
    const endCompleted = performance.now();
    const completedTimeMs = endCompleted - startCompleted;

    console.log('--- Results ---');
    console.log(`isScheduledOn: ${scheduledTimeMs.toFixed(2)} ms`);
    console.log(`isCompletedOn: ${completedTimeMs.toFixed(2)} ms`);
    console.log(`Total time: ${(scheduledTimeMs + completedTimeMs).toFixed(2)} ms`);
  });
});
