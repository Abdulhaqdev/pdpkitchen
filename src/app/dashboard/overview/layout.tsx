'use client';

import { CardSkeleton } from '@/components/card-skeletion';
import OverViewLayout from '@/components/layout/overview-layot';
import { useApiQuery } from '@/lib/api';
import { Suspense } from 'react';

type OverviewData = {
  timestamp: string;
  total_active_students: number;
  today: {
    total_meals: number;
    unique_students: number;
    by_meal_type: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    by_student_type: {
      scholarship: number;
      contract: number;
    };
    average_meals_per_student: number;
  };
  this_week: {
    total_meals: number;
    unique_students: number;
    by_meal_type: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    by_student_type: {
      scholarship: number;
      contract: number;
    };
    average_meals_per_student: number;
  };
  this_month: {
    total_meals: number;
    unique_students: number;
    by_meal_type: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    by_student_type: {
      scholarship: number;
      contract: number;
    };
    average_meals_per_student: number;
  };
};

export default function OverviewPage() {
  const {
    data: stats,
    isPending,
    error
  } = useApiQuery<OverviewData>('stats/overview/');

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-destructive'>Xatolik yuz berdi: {error.message}</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<CardSkeleton />}>
      <OverViewLayout
        sales={null} // Placeholder for sales chart, can be fetched separately
        pie_stats={null} // Placeholder for pie chart
        bar_stats={null} // Placeholder for bar chart
        area_stats={null} // Placeholder for area chart
        stats={stats}
      />
    </Suspense>
  );
}
