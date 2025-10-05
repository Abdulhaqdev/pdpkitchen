'use client';

import { useApiQuery } from '@/lib/api';
import { Suspense } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect, type FormOption } from '@/components/forms/form-select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CardSkeleton } from '@/components/card-skeletion';

type StudentsNotEatingData = {
  total_active_students: number;
  students_never_ate: number;
  students_inactive_days: number;
  filters: {
    days: number;
    course: number;
    student_type: string;
  };
  students: Array<{
    id: number;
    pinfl: string;
    name: string;
    course: number;
    student_type: string;
    enrollment_date: string;
    until_date: string;
    days_since_last_meal: number | null;
    last_meal_date: string | null;
    total_meals: number;
  }>;
};

type FormData = {
  course: number;
  days: number;
  student_type: string;
};

export default function StudentsNotEatingPage() {
  const form = useForm<FormData>({
    defaultValues: {
      course: 1,
      days: 10,
      student_type: 'SCHOLARSHIP'
    }
  });

  const watch = form.watch;
  const queryParams = new URLSearchParams({
    ...(watch('course') && { course: watch('course').toString() }),
    ...(watch('days') && { days: watch('days').toString() }),
    student_type: watch('student_type')
  }).toString();

  const {
    data: stats,
    isPending,
    error
  } = useApiQuery<StudentsNotEatingData>(
    `stats/students-not-eating/?${queryParams}`
  );

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
    <div className='container mx-auto p-4'>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mb-6 space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
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
              name='days'
              label='Kunlar soni'
              placeholder='Kunlar sonini kiriting'
              required
              type='number'
              min={1}
              max={30}
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
        <div className='space-y-6'>
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Umumiy Statistikalar</CardTitle>
              <CardDescription>
                Ovqat yemagan talabalar bo'yicha hisobot
              </CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-primary text-2xl font-bold'>
                  {stats?.total_active_students.toLocaleString() ?? 0}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Jami Faol Talabalar
                </div>
              </div>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-destructive text-2xl font-bold'>
                  {stats?.students_never_ate ?? 0}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Hech qachon ovqat yemagan
                </div>
              </div>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-warning text-2xl font-bold'>
                  {stats?.students_inactive_days ?? 0}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Nofaol kunlar
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Ovqat Yemagan Talabalar Ro'yxati</CardTitle>
              <CardDescription>
                {stats?.students.length ?? 0} ta talaba topildi
              </CardDescription>
            </CardHeader>
            <CardContent className='max-h-[340px] overflow-y-auto'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ism</TableHead>
                      <TableHead>Kurs</TableHead>
                      <TableHead>Talaba Turi</TableHead>
                      <TableHead>Oxirgi ovqat sanasi</TableHead>
                      <TableHead>Oxirgi ovqatdan keyin kunlar</TableHead>
                      <TableHead>Jami ovqatlar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.student_type === 'SCHOLARSHIP'
                                ? 'default'
                                : 'outline'
                            }
                          >
                            {student.student_type === 'SCHOLARSHIP'
                              ? 'Grant'
                              : 'Kontrakt'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {student.last_meal_date || "Yo'q"}
                        </TableCell>
                        <TableCell>
                          {student.days_since_last_meal ?? 'Hech qachon'}
                        </TableCell>
                        <TableCell>{student.total_meals}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={6} className='py-8 text-center'>
                          Ma'lumot topilmadi
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </div>
  );
}
