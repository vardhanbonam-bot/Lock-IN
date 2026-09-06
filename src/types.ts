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

  // Sri Rama Satya: Personal Performance Dashboard Fields
  // 🌅 Morning & Recovery
  bedTime?: string;
  sleepDuration?: string;
  sleepQuality?: number; // 1-5
  gotOutOfBedImmediately?: boolean;
  morningRoutineCompleted?: boolean;
  morningStartScore?: number; // 1-5 (Intentional vs Reactive)
  energyScore?: number; // 1-10
  moodScore?: number; // 1-10
  mentalClarityScore?: number; // 1-10
  todaysBig3?: string[];
  todaysBig3Done?: boolean[];
  todaysRule?: string;

  // 📚 Morning Timetable & Mind
  readingBook?: string;
  readingMinutes?: number;
  readingPages?: number;
  readingKeyIdea?: string;
  meditationMinutes?: number;
  meditationQuality?: number; // 1-5
  meditationInsight?: string;
  morningBufferUsedFor?: string;
  morningPhysicalActivityMinutes?: number;
  freshenedUpBy?: string;
  breakfastQuality?: number; // 1-5
  breakfastProtein?: boolean;
  breakfastJunkFood?: boolean;

  // 📈 Pre-Market & Trading Analysis
  preMarketSentiment?: 'Bullish' | 'Bearish' | 'Neutral' | '';
  niftyIndex?: string;
  bankNiftyIndex?: string;
  otherIndices?: string;
  preMarketNews?: NewsItem[];
  keySectors?: string;
  marketHypothesis?: string;
  eodRealityCheck?: string; // Prediction -> Reality -> Why?

  // 📚 Trading Learning & Feynman Test
  tradingTopic?: string;
  tradingStudyMinutes?: number;
  tradingConceptsLearned?: string;
  tradingExplainWithoutNotes?: 'Yes' | 'Partially' | 'No' | '';
  tradingConceptStillConfused?: string;
  tradingPracticalApp?: string;
  tradingFeynmanTest?: string;
  tradesList?: TradeEntry[];

  // 🍱 Midday Recharge & Physical Performance
  lunchQuality?: number; // 1-5
  lunchEnergyAfter?: number; // 1-10
  hobbyActivity?: string;
  hobbyRechargeScore?: number; // 1-5
  workoutSessionName?: string;
  workoutDuration?: number;
  workoutExercises?: { name: string; done: boolean }[];
  workoutEffort?: number; // 1-10
  workoutPainBefore?: number; // 0-10
  workoutPainAfter?: number; // 0-10
  workoutMobility?: number; // 1-5
  workoutEnergyAfter?: number; // 1-10
  workoutUnusualNotes?: string;

  // 🎯 CAT Preparation (Quant / LRDI / VARC)
  catTopicCategory?: 'Quant' | 'LRDI' | 'VARC' | '';
  catConcept?: string;
  catQuestionsAttempted?: number;
  catQuestionsCorrect?: number;
  catTimeMinutes?: number;
  catMistakeClassification?: CATMistakeClassification;
  catMistakeNotes?: string;

  // 🌙 Evening Mode
  dinnerQuality?: number; // 1-5
  dinnerOvereating?: boolean;
  dinnerEnergyAfter?: number; // 1-10
  eveningMode?: 'Mode A - Deep Work' | 'Mode B - Light Learning' | 'Mode C - Recovery' | 'Mode D - Personal' | '';
  eveningUsedFor?: string;

  // 🧾 10:30 Shutdown Journal & Closing Report
  executionScore?: number; // 1-10
  todaysWins?: string[];
  todaysMistakes?: string[];
  todaysBiggestLearning?: string;
  rootCauseAnalysis?: RootCauseAnalysis;
  tomorrowsCorrections?: string[];
  waterLitersTarget?: number;
  waterLitersActual?: number;
  dailySteps?: number;
  dailyScreenTime?: string;
  sevenDimensionScores?: SevenDimensionScores;
  oneLineClose?: string;

  // 📊 Sunday Intelligence Review
  weeklyDiagnostic?: WeeklyDiagnostic;
}

export interface NewsItem {
  headline: string;
  credibility: 'High' | 'Medium' | 'Low' | '';
  impact: 'Positive' | 'Negative' | 'Neutral' | '';
}

export interface TradeEntry {
  id: string;
  setup: string;
  entry: string;
  stop: string;
  target: string;
  risk: string;
  positionSize: string;
  reason: string;
  time: string;
  result: string; // e.g. "+₹2500"
  rMultiple: string; // e.g. "+2.5R"
  followedPlan: boolean;
  emotionalState: string;
  mistake: string;
  wasDecisionGood: boolean;
}

export interface CATMistakeClassification {
  conceptGap?: boolean;
  calculationError?: boolean;
  misreadQuestion?: boolean;
  timeManagement?: boolean;
  wrongApproach?: boolean;
  carelessness?: boolean;
  poorSelection?: boolean;
}

export interface RootCauseAnalysis {
  problem: string;
  why1: string;
  why2: string;
  solution: string;
}

export interface SevenDimensionScores {
  sleepRecovery: number; // 1-10
  mental: number; // 1-10
  physical: number; // 1-10
  learning: number; // 1-10
  trading: number; // 1-10
  execution: number; // 1-10
  lifestyle: number; // 1-10
  overall: number; // 1-10
}

export interface WeeklyDiagnostic {
  q1Worked: string;
  q2Failed: string;
  q3WastedTime: string;
  q4Improved: string;
  q5BestDays: string;
  q6WorstDays: string;
  q7TradingMistakes: string;
  q8CatWeakAreas: string;
  q9PhysicalProgress: string;
  q10SystemChange: string;
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
