'use client';

import { useApiQuery } from '@/lib/api';
import { StudentHistoryResponse } from '@/types/statistics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  IconToolsKitchen2,
  IconSunrise,
  IconSun,
  IconMoon,
  IconUser,
  IconCalendar
} from '@tabler/icons-react';
import Image from 'next/image';

interface StudentHistoryProps {
  studentId: string;
}

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: 'Nonushta',
  LUNCH: 'Tushlik',
  DINNER: 'Kechki ovqat'
};

const mealTypeIcons: Record<string, React.ReactNode> = {
  BREAKFAST: <IconSunrise className='h-4 w-4 text-orange-500' />,
  LUNCH: <IconSun className='h-4 w-4 text-yellow-500' />,
  DINNER: <IconMoon className='h-4 w-4 text-blue-500' />
};

export default function StudentHistoryPage({ studentId }: StudentHistoryProps) {
  const { data: student, isPending: studentLoading } = useApiQuery<any>(
    `students/${studentId}/`
  );

  const {
    data: history,
    isPending: historyLoading,
    error
  } = useApiQuery<StudentHistoryResponse>(
    `stats/student-history/?pinfl=${student?.pinfl}`,
    { enabled: !!student?.pinfl }
  );

  if (studentLoading || historyLoading) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-[200px]' />
            <Skeleton className='h-4 w-[150px]' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Skeleton className='h-20 w-full' />
              <Skeleton className='h-20 w-full' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-destructive text-center'>
            Xatolik: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!history) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-muted-foreground text-center'>
            Ma'lumot topilmadi
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Student Info */}
      <Card>
        <CardHeader>
          <CardTitle>Talaba ma'lumotlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4'>
            {student?.image ? (
              <Image
                src={student.image}
                alt={history.student.name}
                width={80}
                height={80}
                className='rounded-full object-cover'
              />
            ) : (
              <div className='bg-muted flex h-20 w-20 items-center justify-center rounded-full'>
                <IconUser className='text-muted-foreground h-10 w-10' />
              </div>
            )}
            <div>
              <h3 className='text-xl font-semibold'>{history.student.name}</h3>
              <p className='text-muted-foreground'>{history.student.pinfl}</p>
              <div className='mt-2 flex gap-2'>
                <Badge variant='outline'>{history.student.course}-kurs</Badge>
                <Badge>
                  {history.student.student_type === 'SCHOLARSHIP'
                    ? 'Grant'
                    : 'Kontrakt'}
                </Badge>
                <Badge
                  variant={history.student.is_active ? 'default' : 'secondary'}
                >
                  {history.student.is_active ? 'Faol' : 'Nofaol'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Jami ovqatlanishlar</CardDescription>
            <CardTitle className='flex items-center gap-2 text-3xl'>
              <IconToolsKitchen2 className='h-6 w-6' />
              {history.statistics.total_meals}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Nonushta</CardDescription>
            <CardTitle className='flex items-center gap-2 text-3xl'>
              <IconSunrise className='h-6 w-6 text-orange-500' />
              {history.statistics.by_meal_type.breakfast}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Tushlik</CardDescription>
            <CardTitle className='flex items-center gap-2 text-3xl'>
              <IconSun className='h-6 w-6 text-yellow-500' />
              {history.statistics.by_meal_type.lunch}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Kechki ovqat</CardDescription>
            <CardTitle className='flex items-center gap-2 text-3xl'>
              <IconMoon className='h-6 w-6 text-blue-500' />
              {history.statistics.by_meal_type.dinner}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Date Range */}
      {(history.statistics.first_meal || history.statistics.last_meal) && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconCalendar className='h-5 w-5' />
              Ovqatlanish davri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex gap-8'>
              {history.statistics.first_meal && (
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Birinchi ovqatlanish
                  </p>
                  <p className='font-medium'>
                    {format(
                      new Date(history.statistics.first_meal),
                      'dd.MM.yyyy HH:mm'
                    )}
                  </p>
                </div>
              )}
              {history.statistics.last_meal && (
                <div>
                  <p className='text-muted-foreground text-sm'>
                    Oxirgi ovqatlanish
                  </p>
                  <p className='font-medium'>
                    {format(
                      new Date(history.statistics.last_meal),
                      'dd.MM.yyyy HH:mm'
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Meals */}
      <Card>
        <CardHeader>
          <CardTitle>So'nggi ovqatlanishlar</CardTitle>
          <CardDescription>Oxirgi 50 ta ovqatlanish yozuvi</CardDescription>
        </CardHeader>
        <CardContent>
          {history.recent_meals.length === 0 ? (
            <p className='text-muted-foreground py-8 text-center'>
              Ovqatlanish tarixi topilmadi
            </p>
          ) : (
            <div className='divide-y'>
              {history.recent_meals.map((meal) => (
                <div key={meal.id} className='flex items-center gap-4 py-3'>
                  <div className='flex-shrink-0'>
                    {mealTypeIcons[meal.meal_type]}
                  </div>
                  <div className='flex-1'>
                    <span className='font-medium'>
                      {mealTypeLabels[meal.meal_type] || meal.meal_type}
                    </span>
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    {format(new Date(meal.date), 'dd.MM.yyyy HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
