import { create } from 'zustand';
import Realm from 'realm';
import { Habit, HabitStatus } from '../models/Habit';
import { HabitInput, HabitService } from '../services/HabitService';

interface HabitState {
  habits: Habit[];
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
  initialized: false,
  unsubscribeListener: null,

  initialize: (realm: Realm) => {
    if (get().initialized) return;

    const results = HabitService.getAll(realm);
    const callback = (collection: Realm.OrderedCollection<Habit>) => {
      set({ habits: Array.from(collection) });
    };
    results.addListener(callback);

    set({
      initialized: true,
      habits: Array.from(results),
      unsubscribeListener: () => results.removeListener(callback),
    });
  },

  cleanup: () => {
    get().unsubscribeListener?.();
    set({ initialized: false, unsubscribeListener: null, habits: [] });
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
