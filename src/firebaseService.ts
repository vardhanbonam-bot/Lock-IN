import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { DayData, Expense, CategoryBudget } from "./types";
import { 
  INITIAL_DAYS, 
  INITIAL_EXPENSES, 
  DEFAULT_BUDGETS, 
  DEFAULT_EXPENSE_CATEGORIES,
  createBlankDay
} from "./data";

// Partition database collections by active profile ID
let activeUserId = "sri_rama_satya";

export function setFirebaseUserScope(userId: string) {
  activeUserId = userId;
  console.log(`[Firestore] Switched scope to user: ${userId}`);
}

export function getFirebaseUserScope(): string {
  return activeUserId;
}

const getDaysColl = () => collection(db, "users", activeUserId, "days");
const getExpensesColl = () => collection(db, "users", activeUserId, "expenses");
const getBudgetsColl = () => collection(db, "users", activeUserId, "budgets");
const getCategoriesColl = () => collection(db, "users", activeUserId, "categories");

/**
 * Seeds the Firestore database with initial mock/template data if collections are empty.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    // 1. Seed days
    const daysSnap = await getDocs(getDaysColl());
    if (daysSnap.empty) {
      const batch = writeBatch(db);
      if (activeUserId === "sri_rama_satya") {
        Object.entries(INITIAL_DAYS).forEach(([date, data]) => {
          const docRef = doc(db, "users", activeUserId, "days", date);
          batch.set(docRef, data);
        });
      } else {
        // Seed some elegant demo days for Indu
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Yesterday (Jul 10, 2026 or real relative yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const demoDayYesterday: DayData = {
          ...createBlankDay(yesterdayStr),
          wakeTime: '07:00 AM',
          induExercisesDone: true,
          induExercisesList: 'Yoga stretch, 30 Squats',
          induWater10Glasses: true,
          induPreparedForClass: true,
          induReadNewspaper: true,
          induLearnedNewThing: true,
          induNewThingText: 'Read about the History of Typography',
          induWalked5Km: true,
          induDeepSleepHours: 3.5,
          nonNegRehab: true,
          nonNegMeditation: true,
          nonNegWaterNutrition: true,
          isConfirmed: true
        };

        const demoDayToday: DayData = {
          ...createBlankDay(todayStr),
          wakeTime: '06:45 AM',
          induExercisesDone: true,
          induExercisesList: 'Core Workout & Stretching',
          induWater10Glasses: false,
          induPreparedForClass: true,
          induReadNewspaper: true,
          induLearnedNewThing: true,
          induNewThingText: 'Learned Tailwind dynamic theme attributes',
          induWalked5Km: false,
          induDeepSleepHours: 4.2,
          nonNegRehab: true,
          nonNegMeditation: false,
          nonNegWaterNutrition: false,
          isConfirmed: false
        };

        batch.set(doc(db, "users", activeUserId, "days", yesterdayStr), demoDayYesterday);
        batch.set(doc(db, "users", activeUserId, "days", todayStr), demoDayToday);
      }
      await batch.commit();
      console.log(`Seeded default tracker days for user ${activeUserId} to Firestore.`);
    }

    // 2. Seed expenses
    const expensesSnap = await getDocs(getExpensesColl());
    if (expensesSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_EXPENSES.forEach((exp) => {
        const docRef = doc(db, "users", activeUserId, "expenses", exp.id);
        batch.set(docRef, exp);
      });
      await batch.commit();
      console.log(`Seeded default expense transactions for user ${activeUserId} to Firestore.`);
    }

    // 3. Seed categories
    const categoriesSnap = await getDocs(getCategoriesColl());
    if (categoriesSnap.empty) {
      const batch = writeBatch(db);
      DEFAULT_EXPENSE_CATEGORIES.forEach((cat) => {
        const docRef = doc(db, "users", activeUserId, "categories", cat);
        batch.set(docRef, { name: cat });
      });
      await batch.commit();
      console.log(`Seeded default categories for user ${activeUserId} to Firestore.`);
    }

    // 4. Seed budgets
    const budgetsSnap = await getDocs(getBudgetsColl());
    if (budgetsSnap.empty) {
      const batch = writeBatch(db);
      DEFAULT_BUDGETS.forEach((b) => {
        const docRef = doc(db, "users", activeUserId, "budgets", b.category);
        batch.set(docRef, b);
      });
      await batch.commit();
      console.log(`Seeded default budgets for user ${activeUserId} to Firestore.`);
    }
  } catch (error) {
    console.error(`Error during database seeding for user ${activeUserId}:`, error);
  }
}

/**
 * Fetch all tracker logs
 */
export async function getDaysFromFirebase(): Promise<Record<string, DayData>> {
  const querySnapshot = await getDocs(getDaysColl());
  const daysMap: Record<string, DayData> = {};
  querySnapshot.forEach((doc) => {
    daysMap[doc.id] = doc.data() as DayData;
  });
  return daysMap;
}

/**
 * Save / update a single tracker log day
 */
export async function saveDayToFirebase(date: string, data: DayData): Promise<void> {
  const docRef = doc(db, "users", activeUserId, "days", date);
  await setDoc(docRef, data, { merge: true });
}

/**
 * Fetch all expenses sorted by date descending
 */
export async function getExpensesFromFirebase(): Promise<Expense[]> {
  const querySnapshot = await getDocs(getExpensesColl());
  const list: Expense[] = [];
  querySnapshot.forEach((doc) => {
    list.push(doc.data() as Expense);
  });
  return list.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Save/update an expense
 */
export async function saveExpenseToFirebase(expense: Expense): Promise<void> {
  const docRef = doc(db, "users", activeUserId, "expenses", expense.id);
  await setDoc(docRef, expense);
}

/**
 * Delete an expense
 */
export async function deleteExpenseFromFirebase(id: string): Promise<void> {
  const docRef = doc(db, "users", activeUserId, "expenses", id);
  await deleteDoc(docRef);
}

/**
 * Fetch categories
 */
export async function getCategoriesFromFirebase(): Promise<string[]> {
  const querySnapshot = await getDocs(getCategoriesColl());
  const list: string[] = [];
  querySnapshot.forEach((doc) => {
    list.push(doc.id);
  });
  return list;
}

/**
 * Add custom category
 */
export async function saveCategoryToFirebase(categoryName: string): Promise<void> {
  const docRef = doc(db, "users", activeUserId, "categories", categoryName);
  await setDoc(docRef, { name: categoryName });
}

/**
 * Delete custom category
 */
export async function deleteCategoryFromFirebase(categoryName: string): Promise<void> {
  const docRef = doc(db, "users", activeUserId, "categories", categoryName);
  await deleteDoc(docRef);
}

/**
 * Fetch budgets
 */
export async function getBudgetsFromFirebase(): Promise<CategoryBudget[]> {
  const querySnapshot = await getDocs(getBudgetsColl());
  const list: CategoryBudget[] = [];
  querySnapshot.forEach((doc) => {
    list.push(doc.data() as CategoryBudget);
  });
  return list;
}

/**
 * Save/update budget limit
 */
export async function saveBudgetToFirebase(budget: CategoryBudget): Promise<void> {
  const docRef = doc(db, "users", activeUserId, "budgets", budget.category);
  await setDoc(docRef, budget);
}

/**
 * Delete budget
 */
export async function deleteBudgetFromFirebase(category: string): Promise<void> {
  const docRef = doc(db, "users", activeUserId, "budgets", category);
  await deleteDoc(docRef);
}
