import { createRealmContext } from '@realm/react';
import { Habit, HabitCompletion } from '../models';

export const DatabaseContext = createRealmContext({
  schema: [Habit, HabitCompletion],
  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true,
});

export const { RealmProvider, useRealm, useQuery, useObject } = DatabaseContext;
