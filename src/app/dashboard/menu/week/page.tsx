'use client';

import { useApiQuery } from '@/lib/api';
import { WeekMenuResponse } from '@/types/menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format, addDays } from 'date-fns';
import { uz } from 'date-fns/locale';
import { IconSunrise, IconSun, IconMoon } from '@tabler/icons-react';

const dayNames = [
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
  'Yakshanba'
];

export default function CurrentWeekMenuPage() {
  const { data, isPending, error } = useApiQuery<WeekMenuResponse>(
    'meal-orders/menu/week/'
  );

  if (isPending) {
    return (
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-32' />
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-7'>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className='h-40' />
              ))}
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

  const weekStart = data?.week_start ? new Date(data.week_start) : new Date();
  const menus = data?.menus || [];

  // Create menu lookup map
  const menuByDate = new Map(menus.map((m) => [m.menu_date, m]));

  // Generate 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      date: dateStr,
      dayName: dayNames[i],
      displayDate: format(date, 'd MMM', { locale: uz }),
      isToday: dateStr === format(new Date(), 'yyyy-MM-dd'),
      menu: menuByDate.get(dateStr)
    };
  });

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Shu hafta menyusi</CardTitle>
          <CardDescription>
            {format(weekStart, 'd MMM', { locale: uz })} -{' '}
            {format(addDays(weekStart, 6), 'd MMM yyyy', { locale: uz })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-7'>
            {weekDays.map((day) => (
              <Card
                key={day.date}
                className={`border ${day.isToday ? 'ring-primary border-primary ring-2' : ''}`}
              >
                <CardContent className='space-y-3 p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-sm font-semibold'>{day.dayName}</div>
                      <div className='text-muted-foreground text-xs'>
                        {day.displayDate}
                      </div>
                    </div>
                    {day.isToday && (
                      <Badge variant='default' className='text-xs'>
                        Bugun
                      </Badge>
                    )}
                  </div>

                  <div className='min-h-[80px] space-y-2'>
                    <div className='flex items-start gap-2'>
                      <IconSunrise className='mt-1 h-3 w-3 flex-shrink-0 text-orange-500' />
                      <span className='text-xs'>
                        {day.menu?.breakfast_dish || (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <IconSun className='mt-1 h-3 w-3 flex-shrink-0 text-yellow-500' />
                      <span className='text-xs'>
                        {day.menu?.lunch_dish || (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </span>
                    </div>
                    <div className='flex items-start gap-2'>
                      <IconMoon className='mt-1 h-3 w-3 flex-shrink-0 text-blue-500' />
                      <span className='text-xs'>
                        {day.menu?.dinner_dish || (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
