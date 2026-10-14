import { create } from 'zustand';
import Realm from 'realm';
import { Habit, HabitStatus } from '../models/Habit';
import { HabitInput, HabitService } from '../services/HabitService';

interface HabitState {
  habits: Habit[];
  activeHabits: Habit[];
  initialized: boolean;
  unsubscribeListener: (() => void) | null;

  initialize: (realm: Realm) => void;
  cleanup: () => void;
  add: (realm: Realm, input: HabitInput) => void;
  update: (realm: Realm, id: string | Realm.BSON.ObjectId, data: Partial<HabitInput>) => void;
  setStatus: (realm: Realm, id: string | Realm.BSON.ObjectId, status: HabitStatus) => void;
  remove: (realm: Realm, id: string | Realm.BSON.ObjectId) => void;
  toggleToday: (realm: Realm, id: string | Realm.BSON.ObjectId) => void;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  activeHabits: [],
  initialized: false,
  unsubscribeListener: null,

  initialize: (realm: Realm) => {
    if (get().initialized) return;

    const results = HabitService.getAll(realm);
    const callback = (collection: Realm.OrderedCollection<Habit>) => {
      const habitsList = Array.from(collection);
      set({ habits: habitsList, activeHabits: habitsList.filter((h) => h.status === 'active') });
    };
    results.addListener(callback);

    const initialHabits = Array.from(results);
    set({
      initialized: true,
      habits: initialHabits,
      activeHabits: initialHabits.filter((h) => h.status === 'active'),
      unsubscribeListener: () => results.removeListener(callback),
    });
  },

  cleanup: () => {
    get().unsubscribeListener?.();
    set({ initialized: false, unsubscribeListener: null, habits: [], activeHabits: [] });
  },

  add: (realm, input) => {
    HabitService.add(realm, input);
  },

  update: (realm, id, data) => {
    const habit = HabitService.getById(realm, id);
    if (habit) HabitService.update(realm, habit, data);
  },

  setStatus: (realm, id, status) => {
    const habit = HabitService.getById(realm, id);
    if (habit) HabitService.setStatus(realm, habit, status);
  },

  remove: (realm, id) => {
    const habit = HabitService.getById(realm, id);
    if (habit) HabitService.delete(realm, habit);
  },

  toggleToday: (realm, id) => {
    const habit = HabitService.getById(realm, id);
    if (habit) HabitService.toggleToday(realm, habit);
  },
}));
