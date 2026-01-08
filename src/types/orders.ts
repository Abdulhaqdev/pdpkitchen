// Order Types based on OpenAPI spec

import { StudentBasic, StudentDetailInOrder } from './students';

export interface MealOrderWithStudent {
  id: number;
  student: StudentBasic;
  order_date: string;
  breakfast_ordered: boolean;
  lunch_ordered: boolean;
  dinner_ordered: boolean;
  created_at: string;
}

export interface OrderStatistics {
  date: string;
  total_students_ordered: number;
  breakfast_count: number;
  lunch_count: number;
  dinner_count: number;
  orders: MealOrderWithStudent[];
}

export interface OrderedMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface PendingMealItem {
  order_id: number;
  student: StudentDetailInOrder;
  order_date: string;
  ordered_meals: OrderedMeals;
  pending_meal_types: string[];
  ordered_at: string;
}

export interface PendingMealsResponse {
  date: string;
  total_pending: number;
  filters_applied: Record<string, unknown>;
  pending_meals: PendingMealItem[];
}

export interface StudentWhoOrderedItem {
  order_id: number;
  student: StudentDetailInOrder;
  order_date: string;
  ordered_at: string;
}

export interface StudentsWhoOrderedResponse {
  date: string;
  meal_type: string;
  total_count: number;
  filters_applied: Record<string, unknown>;
  students: StudentWhoOrderedItem[];
}

export interface OrderFilters {
  date: string;
  meal_type?: string;
  student_type?: string;
  course?: number;
}
