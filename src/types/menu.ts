// Weekly Menu Types based on OpenAPI spec

export interface WeeklyMenu {
  id: number;
  menu_date: string; // YYYY-MM-DD format
  day_of_week: string;
  breakfast_dish: string | null;
  lunch_dish: string | null;
  dinner_dish: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface WeeklyMenuRequest {
  menu_date: string;
  breakfast_dish?: string | null;
  lunch_dish?: string | null;
  dinner_dish?: string | null;
}

export interface WeekMenuResponse {
  week_start: string;
  week_end: string;
  menus: WeeklyMenu[];
}
