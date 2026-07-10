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
  DEFAULT_EXPENSE_CATEGORIES 
} from "./data";

const DAYS_COLL = "days";
const EXPENSES_COLL = "expenses";
const BUDGETS_COLL = "budgets";
const CATEGORIES_COLL = "categories";

/**
 * Seeds the Firestore database with initial mock/template data if collections are empty.
 */
export async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    // 1. Seed days
    const daysSnap = await getDocs(collection(db, DAYS_COLL));
    if (daysSnap.empty) {
      const batch = writeBatch(db);
      Object.entries(INITIAL_DAYS).forEach(([date, data]) => {
        const docRef = doc(db, DAYS_COLL, date);
        batch.set(docRef, data);
      });
      await batch.commit();
      console.log("Seeded default tracker days to Firestore.");
    }

    // 2. Seed expenses
    const expensesSnap = await getDocs(collection(db, EXPENSES_COLL));
    if (expensesSnap.empty) {
      const batch = writeBatch(db);
      INITIAL_EXPENSES.forEach((exp) => {
        const docRef = doc(db, EXPENSES_COLL, exp.id);
        batch.set(docRef, exp);
      });
      await batch.commit();
      console.log("Seeded default expense transactions to Firestore.");
    }

    // 3. Seed categories
    const categoriesSnap = await getDocs(collection(db, CATEGORIES_COLL));
    if (categoriesSnap.empty) {
      const batch = writeBatch(db);
      DEFAULT_EXPENSE_CATEGORIES.forEach((cat) => {
        const docRef = doc(db, CATEGORIES_COLL, cat);
        batch.set(docRef, { name: cat });
      });
      await batch.commit();
      console.log("Seeded default categories to Firestore.");
    }

    // 4. Seed budgets
    const budgetsSnap = await getDocs(collection(db, BUDGETS_COLL));
    if (budgetsSnap.empty) {
      const batch = writeBatch(db);
      DEFAULT_BUDGETS.forEach((b) => {
        const docRef = doc(db, BUDGETS_COLL, b.category);
        batch.set(docRef, b);
      });
      await batch.commit();
      console.log("Seeded default budgets to Firestore.");
    }
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

/**
 * Fetch all tracker logs
 */
export async function getDaysFromFirebase(): Promise<Record<string, DayData>> {
  const querySnapshot = await getDocs(collection(db, DAYS_COLL));
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
  const docRef = doc(db, DAYS_COLL, date);
  await setDoc(docRef, data, { merge: true });
}

/**
 * Fetch all expenses sorted by date descending
 */
export async function getExpensesFromFirebase(): Promise<Expense[]> {
  const querySnapshot = await getDocs(collection(db, EXPENSES_COLL));
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
  const docRef = doc(db, EXPENSES_COLL, expense.id);
  await setDoc(docRef, expense);
}

/**
 * Delete an expense
 */
export async function deleteExpenseFromFirebase(id: string): Promise<void> {
  const docRef = doc(db, EXPENSES_COLL, id);
  await deleteDoc(docRef);
}

/**
 * Fetch categories
 */
export async function getCategoriesFromFirebase(): Promise<string[]> {
  const querySnapshot = await getDocs(collection(db, CATEGORIES_COLL));
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
  const docRef = doc(db, CATEGORIES_COLL, categoryName);
  await setDoc(docRef, { name: categoryName });
}

/**
 * Delete custom category
 */
export async function deleteCategoryFromFirebase(categoryName: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLL, categoryName);
  await deleteDoc(docRef);
}

/**
 * Fetch budgets
 */
export async function getBudgetsFromFirebase(): Promise<CategoryBudget[]> {
  const querySnapshot = await getDocs(collection(db, BUDGETS_COLL));
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
  const docRef = doc(db, BUDGETS_COLL, budget.category);
  await setDoc(docRef, budget);
}

/**
 * Delete budget
 */
export async function deleteBudgetFromFirebase(category: string): Promise<void> {
  const docRef = doc(db, BUDGETS_COLL, category);
  await deleteDoc(docRef);
}
