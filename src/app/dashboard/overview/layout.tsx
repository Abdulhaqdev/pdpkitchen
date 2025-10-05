'use client';
import OverViewLayout from '@/components/layout/overview-layot';
import { useApiQuery } from '@/lib/api';
import { Suspense } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect, type FormOption } from '@/components/forms/form-select';
import { CardSkeleton } from '@/components/card-skeletion';

type RangeOverviewData = {
  date_range: {
    start: string;
    end: string;
    days: number;
  };
  filters_applied: {
    student_type: string;
    course: number;
  };
  summary: {
    total_meals: number;
    unique_students: number;
    by_meal_type: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
  };
  daily_breakdown: Array<{
    date: string;
    total: number;
    breakfast: number;
    lunch: number;
    dinner: number;
  }>;
};

type FormData = {
  course: number;
  start_date: string;
  end_date: string;
  student_type: string;
};

export default function OverviewPage() {
  const form = useForm<FormData>({
    defaultValues: {
      course: 2,
      start_date: '2025-10-02',
      end_date: '2025-10-05',
      student_type: 'SCHOLARSHIP'
    }
  });

  const watch = form.watch;
  const startDate = watch('start_date');
  const queryParams = new URLSearchParams({
    ...(watch('course') && { course: watch('course').toString() }),
    start_date: watch('start_date'),
    end_date: watch('end_date'),
    student_type: watch('student_type')
  }).toString();

  const {
    data: stats,
    isPending,
    error
  } = useApiQuery<RangeOverviewData>(`stats/by-range/?${queryParams}`);

  const onSubmit = (data: FormData) => {
    console.log('Form submitted with:', data);
  };

  const studentTypeOptions: FormOption[] = [
    { label: 'Grant', value: 'SCHOLARSHIP' },
    { label: 'Kontrakt', value: 'CONTRACT' }
  ];

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-destructive'>Xatolik yuz berdi: {error.message}</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mb-6 space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <FormInput
              control={form.control}
              name='course'
              label='Kurs'
              placeholder='Kursni kiriting'
              required
              type='number'
              min={1}
              max={4}
            />
            <FormInput
              control={form.control}
              name='start_date'
              label='Boshlanish Sanasi'
              type='date'
              required
              max={new Date().toISOString().split('T')[0]} // Max today
            />
            <FormInput
              control={form.control}
              name='end_date'
              label='Tugash Sanasi'
              type='date'
              required
              min={startDate} // Min start_date
              max={new Date().toISOString().split('T')[0]} // Max today
            />
            <FormSelect
              control={form.control}
              name='student_type'
              label='Talaba Turi'
              options={studentTypeOptions}
              required
            />
          </div>
        </form>
      </FormProvider>

      <Suspense fallback={<CardSkeleton />}>
        <OverViewLayout
          sales={null}
          pie_stats={null}
          bar_stats={null}
          area_stats={null}
          stats={stats}
        />
      </Suspense>
    </div>
  );
}
