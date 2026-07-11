import { DayData, Expense, CategoryBudget } from './types';

export const DEFAULT_REHAB_EXERCISES_1 = [
  { name: 'Band Pull-Aparts (3x15)', done: true },
  { name: 'Rotator Cuff Rotations (3x12)', done: true },
  { name: 'Scapular Wall Slides (3x10)', done: true }
];

export const DEFAULT_REHAB_EXERCISES_2 = [
  { name: 'Hamstring Flossing (3x12)', done: true },
  { name: 'Tibialis Raises (3x20)', done: true },
  { name: 'Soleus Calf Raises (3x15)', done: true }
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Education',
  'Health',
  'Household',
  'Family',
  'Subscriptions',
  'Entertainment',
  'Misc'
];

export const DEFAULT_BUDGETS: CategoryBudget[] = [
  { category: 'Food', limit: 12000 },
  { category: 'Transport', limit: 4000 },
  { category: 'Education', limit: 8000 },
  { category: 'Health', limit: 5000 },
  { category: 'Household', limit: 10000 },
  { category: 'Family', limit: 6000 },
  { category: 'Subscriptions', limit: 3000 },
  { category: 'Entertainment', limit: 5000 },
  { category: 'Misc', limit: 3000 }
];

export function createBlankDay(date: string): DayData {
  return {
    date,
    wakeTime: '',
    targetWakeWindow: '06:00 - 06:30',
    noPhoneHour: false,
    noPhoneNote: '',
    waterFirstGlass: '',
    waterTotalGlasses: 0,
    meditationDone: false,
    meditationDuration: 0,
    readingWhat: '',
    readingDuration: 0,
    morningWalkDistance: 0,
    morningWalkFeel: '',
    preWorkoutSnack: '',
    rehabFocusText: '',
    rehab1: {
      exercises: DEFAULT_REHAB_EXERCISES_1.map(e => ({ ...e, done: false })),
      painBefore: 5,
      painAfter: 3
    },
    breakfastTime: '',
    breakfastWhat: '',
    deepWork1Task: '',
    deepWork1Hours: 0,
    deepWork1Focus: 5,
    lunchTime: '',
    lunchWhat: '',
    napDuration: 0,
    napFeel: '',
    hobbyWhat: '',
    hobbyDuration: 0,
    eveningSnack: '',
    deepWork2Task: '',
    deepWork2Hours: 0,
    deepWork2Focus: 5,
    rehab2: {
      exercises: DEFAULT_REHAB_EXERCISES_2.map(e => ({ ...e, done: false })),
      painBefore: 5,
      painAfter: 3
    },
    dinnerTime: '',
    dinnerWhat: '',
    journalLines: '',
    sleepTime: '',
    kpiPainScore: 4,
    kpiMoodScore: 7,
    kpiSleepHours: 7.5,
    kpiPagesRead: 0,
    nonNegRehab: false,
    nonNegMeditation: false,
    nonNegWaterNutrition: false,
    bonusReading: false,
    bonusJournal: false,
    bonusDeepStudy: false,
    bonusFocusProtected: false,
    customTasks: [],
    weeklyWins: '',
    weeklyLosses: '',
    weeklyData: '',
    weeklyBottlenecks: '',
    weeklyExperiments: '',
    weeklyPriorities: '',
    weeklyGratitude: '',
    isConfirmed: false
  };
}

// Generate some structured pre-populated days ending yesterday (Jul 9, 2026) to demonstrate active streak!
export const INITIAL_DAYS: Record<string, DayData> = {
  '2026-07-08': {
    date: '2026-07-08',
    wakeTime: '06:15',
    targetWakeWindow: '06:00 - 06:30',
    noPhoneHour: true,
    noPhoneNote: '',
    waterFirstGlass: '06:25',
    waterTotalGlasses: 8,
    meditationDone: true,
    meditationDuration: 15,
    readingWhat: 'Atomic Habits by James Clear',
    readingDuration: 20,
    morningWalkDistance: 3.5,
    morningWalkFeel: 'Energetic, calves a bit tight but pain is down.',
    preWorkoutSnack: 'Banana & black coffee',
    rehab1: {
      exercises: DEFAULT_REHAB_EXERCISES_1.map(e => ({ ...e, done: true })),
      painBefore: 4,
      painAfter: 2
    },
    breakfastTime: '09:00',
    breakfastWhat: 'Scrambled eggs, sourdough toast, avocado',
    deepWork1Task: 'Interactive UI Refactor - core modules',
    deepWork1Hours: 3.5,
    deepWork1Focus: 9,
    lunchTime: '13:00',
    lunchWhat: 'Chicken rice bowl with broccoli',
    napDuration: 20,
    napFeel: 'refreshed',
    hobbyWhat: 'Tech blogs & geopolitical podcasts',
    hobbyDuration: 30,
    eveningSnack: 'Protein shake + almonds',
    deepWork2Task: 'API integrations & error handling state',
    deepWork2Hours: 2.5,
    deepWork2Focus: 8,
    rehab2: {
      exercises: DEFAULT_REHAB_EXERCISES_2.map(e => ({ ...e, done: true })),
      painBefore: 5,
      painAfter: 2
    },
    dinnerTime: '20:00',
    dinnerWhat: 'Salmon fillet with sweet potato mash',
    journalLines: 'Crushed deep work today. Shoulder is healing. Locked in.',
    sleepTime: '22:30',
    kpiPainScore: 2,
    kpiMoodScore: 9,
    kpiSleepHours: 8,
    kpiPagesRead: 15,
    nonNegRehab: true,
    nonNegMeditation: true,
    nonNegWaterNutrition: true,
    bonusReading: true,
    bonusJournal: true,
    bonusDeepStudy: true,
    bonusFocusProtected: true,
    weeklyWins: '',
    weeklyLosses: '',
    weeklyData: '',
    weeklyBottlenecks: '',
    weeklyExperiments: '',
    weeklyPriorities: '',
    weeklyGratitude: ''
  },
  '2026-07-09': {
    date: '2026-07-09',
    wakeTime: '06:10',
    targetWakeWindow: '06:00 - 06:30',
    noPhoneHour: true,
    noPhoneNote: '',
    waterFirstGlass: '06:15',
    waterTotalGlasses: 9,
    meditationDone: true,
    meditationDuration: 15,
    readingWhat: 'Atomic Habits by James Clear',
    readingDuration: 25,
    morningWalkDistance: 4.2,
    morningWalkFeel: 'Very smooth, hips loose, feeling strong.',
    preWorkoutSnack: 'Oatmeal with blueberries',
    rehab1: {
      exercises: DEFAULT_REHAB_EXERCISES_1.map(e => ({ ...e, done: true })),
      painBefore: 3,
      painAfter: 1
    },
    breakfastTime: '08:45',
    breakfastWhat: 'Whey protein bowl, mixed seeds, dates',
    deepWork1Task: 'Database schema and migration setup',
    deepWork1Hours: 4,
    deepWork1Focus: 9,
    lunchTime: '13:15',
    lunchWhat: 'Tuna wrap with spinach and tomatoes',
    napDuration: 15,
    napFeel: 'refreshed',
    hobbyWhat: 'Sketching and 3D modeling fundamentals',
    hobbyDuration: 45,
    eveningSnack: 'Greek yogurt with honey',
    deepWork2Task: 'Automated testing and schema review',
    deepWork2Hours: 2,
    deepWork2Focus: 8,
    rehab2: {
      exercises: DEFAULT_REHAB_EXERCISES_2.map(e => ({ ...e, done: true })),
      painBefore: 4,
      painAfter: 1
    },
    dinnerTime: '19:45',
    dinnerWhat: 'Grilled paneer with roasted asparagus',
    journalLines: 'Another consecutive day hitting the core floor. Felt deep flow state during code building.',
    sleepTime: '22:15',
    kpiPainScore: 1,
    kpiMoodScore: 9,
    kpiSleepHours: 7.8,
    kpiPagesRead: 20,
    nonNegRehab: true,
    nonNegMeditation: true,
    nonNegWaterNutrition: true,
    bonusReading: true,
    bonusJournal: true,
    bonusDeepStudy: true,
    bonusFocusProtected: true,
    weeklyWins: '',
    weeklyLosses: '',
    weeklyData: '',
    weeklyBottlenecks: '',
    weeklyExperiments: '',
    weeklyPriorities: '',
    weeklyGratitude: ''
  }
};

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-07-02',
    amount: 1500,
    category: 'Health',
    paymentMethod: 'UPI',
    note: 'Resistance band kit and gym chalk'
  },
  {
    id: 'exp-2',
    date: '2026-07-04',
    amount: 850,
    category: 'Food',
    paymentMethod: 'UPI',
    note: 'High-protein groceries, liquid egg whites'
  },
  {
    id: 'exp-3',
    date: '2026-07-05',
    amount: 1200,
    category: 'Subscriptions',
    paymentMethod: 'Card',
    note: 'Cloud IDE and server hosting'
  },
  {
    id: 'exp-4',
    date: '2026-07-07',
    amount: 450,
    category: 'Transport',
    paymentMethod: 'Cash',
    note: 'Cabs to rehab clinic'
  },
  {
    id: 'exp-5',
    date: '2026-07-08',
    amount: 3200,
    category: 'Education',
    paymentMethod: 'Card',
    note: 'Advanced Algorithms and Architecture Course'
  },
  {
    id: 'exp-6',
    date: '2026-07-09',
    amount: 600,
    category: 'Food',
    paymentMethod: 'UPI',
    note: 'Sourdough bakery and electrolyte tub'
  },
  {
    id: 'exp-7',
    date: '2026-07-10',
    amount: 950,
    category: 'Household',
    paymentMethod: 'UPI',
    note: 'Ergonomic lumbar support cushion'
  }
];
