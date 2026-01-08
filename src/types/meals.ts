// Meal Types based on OpenAPI spec

import { StudentDetail, StudentList } from './students';

export type MealTypeEnum = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface MealLog {
  id: number;
  student_details: StudentList;
  meal_date: string;
  meal_type: MealTypeEnum;
  student: number;
}

export interface MealLogList {
  id: number;
  student: number;
  pinfl: string;
  first_name: string;
  last_name: string;
  student_name: string;
  meal_type: MealTypeEnum;
  meal_date: string;
}

export interface MealLogRequest {
  meal_type?: MealTypeEnum;
  student: number;
}

export interface MealLogWithStudent {
  id: number;
  student: StudentDetail;
  meal_type: MealTypeEnum;
  meal_type_display: string;
  meal_date: string;
}

export interface CountsByType {
  breakfast: number;
  lunch: number;
  dinner: number;
}

// Alias for statistics compatibility
export type MealTypeBreakdown = CountsByType;

export interface Filters {
  meal_type: string[] | null;
  pinfl: string | null;
}

export interface MealsByDateResponse {
  date: string;
  total_count: number;
  counts_by_type: CountsByType;
  filters: Filters;
  meals: MealLogWithStudent[];
}

export interface FaceMealLogRequest {
  image: File;
  meal_type: MealTypeEnum;
}

export interface FaceMealLogResponse {
  success: boolean;
  message: string;
  meal_log?: MealLog;
  student?: StudentDetail;
  similarity_score?: number;
  existing_log?: MealLog;
}

export interface PeriodStat {
  total: number;
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface MealStatisticsResponse {
  today: PeriodStat;
  this_week: PeriodStat;
  this_month: PeriodStat;
}

export interface RecentMeal {
  id: number;
  meal_type: MealTypeEnum;
  date: string;
}
