// Statistics Types based on OpenAPI spec

import { MealTypeBreakdown, RecentMeal } from './meals';
import {
  InactiveStudent,
  StudentDetailedInfo,
  StudentTypeEnum
} from './students';

export interface DateRangeInfo {
  start: string;
  end: string;
  days: number;
}

export interface DailyBreakdown {
  date: string;
  total: number;
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface DateRangeSummary {
  total_meals: number;
  unique_students: number;
  by_meal_type: MealTypeBreakdown;
  average_meals_per_day: number;
  average_meals_per_student: number;
}

export interface DateRangeResponse {
  date_range: DateRangeInfo;
  filters_applied: Record<string, unknown>;
  summary: DateRangeSummary;
  daily_breakdown: DailyBreakdown[];
}

export interface StudentHistoryStats {
  total_meals: number;
  by_meal_type: MealTypeBreakdown;
  first_meal: string | null;
  last_meal: string | null;
}

export interface StudentHistoryResponse {
  student: StudentDetailedInfo;
  statistics: StudentHistoryStats;
  recent_meals: RecentMeal[];
}

export interface StudentsNotEatingResponse {
  total_active_students: number;
  students_never_ate: number;
  students_inactive_days: number;
  filters: Record<string, unknown>;
  students: InactiveStudent[];
}

export interface FaceDbStats {
  total_registered: number;
  active_faces: number;
  inactive_faces: number;
  last_updated?: string;
}

export interface StatisticsFilters {
  start_date: string;
  end_date?: string;
  meal_type?: string;
  student_type?: StudentTypeEnum;
  course?: number;
}
