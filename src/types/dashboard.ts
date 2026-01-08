// Dashboard consolidated API Types based on OpenAPI spec

import { PeriodStat } from './meals';

export interface DashboardResponse {
  timestamp: string;
  students: StudentStats;
  meals: MealStats;
  orders: OrderStats;
  complaints: DashboardComplaintStats;
}

export interface StudentStats {
  total_active: number;
  with_face_embedding: number;
  by_type: StudentTypeBreakdown;
}

export interface StudentTypeBreakdown {
  scholarship: number;
  contract: number;
}

export interface MealStats {
  today: PeriodStat;
  this_week: PeriodStat;
  this_month: PeriodStat;
}

export interface OrderStats {
  date: string;
  total_orders: number;
  breakfast_count: number;
  lunch_count: number;
  dinner_count: number;
}

export interface DashboardComplaintStats {
  pending: number;
  reviewed: number;
  resolved: number;
  rejected: number;
}
