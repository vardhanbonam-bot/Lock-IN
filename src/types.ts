export interface RehabSession {
  exercises: { name: string; done: boolean }[];
  painBefore: number; // 1-10
  painAfter: number; // 1-10
}

export interface DayData {
  date: string; // YYYY-MM-DD

  // Morning
  wakeTime: string;
  targetWakeWindow: string;
  noPhoneHour: boolean;
  noPhoneNote: string;
  waterFirstGlass: string;
  waterTotalGlasses: number;
  meditationDone: boolean;
  meditationDuration: number; // minutes
  readingWhat: string;
  readingDuration: number; // minutes
  morningWalkDistance: number; // km
  morningWalkFeel: string;
  preWorkoutSnack: string;
  rehabFocusText?: string; // Day-to-day custom rehab focus
  rehab1: RehabSession;
  breakfastTime: string;
  breakfastWhat: string;

  // Midday
  deepWork1Task: string;
  deepWork1Hours: number;
  deepWork1Focus: number; // 1-10
  lunchTime: string;
  lunchWhat: string;
  napDuration: number; // minutes
  napFeel: 'refreshed' | 'groggy' | '';

  // Afternoon
  hobbyWhat: string;
  hobbyDuration: number; // minutes
  eveningSnack: string;
  deepWork2Task: string;
  deepWork2Hours: number;
  deepWork2Focus: number; // 1-10

  // Evening
  rehab2: RehabSession;
  dinnerTime: string;
  dinnerWhat: string;
  journalLines: string;
  sleepTime: string;

  // Daily KPIs
  kpiPainScore: number; // 1-10
  kpiMoodScore: number; // 1-10
  kpiSleepHours: number;
  kpiPagesRead: number;

  // Non-negotiables & Bonus Checklist Toggles
  // These drive the progress states. We can sync or allow manual toggle.
  nonNegRehab: boolean;
  nonNegMeditation: boolean;
  nonNegWaterNutrition: boolean;

  bonusReading: boolean;
  bonusJournal: boolean;
  bonusDeepStudy: boolean;
  bonusFocusProtected: boolean;
  isConfirmed?: boolean;
  customTasks?: { id: string; name: string; done: boolean }[];

  // Indu's specialized tracking fields (User 2)
  induExercisesDone?: boolean;
  induExercisesList?: string;
  induWater10Glasses?: boolean;
  induPreparedForClass?: boolean;
  induReadNewspaper?: boolean;
  induLearnedNewThing?: boolean;
  induNewThingText?: string;
  induWalked5Km?: boolean;
  induDeepSleepHours?: number;

  // Weekly (Sunday only)
  weeklyWins: string;
  weeklyLosses: string;
  weeklyData: string;
  weeklyBottlenecks: string;
  weeklyExperiments: string;
  weeklyPriorities: string;
  weeklyGratitude: string;
}

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // ₹
  category: string;
  paymentMethod: string;
  note: string;
}

export interface CategoryBudget {
  category: string;
  limit: number;
}
