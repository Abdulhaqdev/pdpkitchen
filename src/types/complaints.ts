// Complaint Types based on OpenAPI spec

import { StudentBasic } from './students';
import { MealTypeEnum } from './meals';

export type ComplaintStatusEnum =
  | 'PENDING'
  | 'REVIEWED'
  | 'RESOLVED'
  | 'REJECTED';

export interface ComplaintRead {
  id: number;
  student: StudentBasic;
  meal_log: number;
  meal_type: string;
  meal_type_display: string;
  meal_date: string;
  complaint_text: string;
  image: string | null;
  status: ComplaintStatusEnum;
  status_display: string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface ComplaintStatusUpdate {
  status?: ComplaintStatusEnum;
  admin_response?: string;
}

export interface StatusBreakdown {
  pending: number;
  reviewed: number;
  resolved: number;
  rejected: number;
}

export interface MealTypeBreakdown {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface ComplaintStatistics {
  total_complaints: number;
  by_status: StatusBreakdown;
  by_meal_type: MealTypeBreakdown;
}

export interface ComplaintFilters {
  status?: ComplaintStatusEnum;
  meal_type?: MealTypeEnum;
  course?: number;
  student_type?: string;
  pinfl?: string;
}
