'use client';

import { useState } from 'react';
import { useApiQuery } from '@/lib/api';
import { WeekMenuResponse, WeeklyMenu } from '@/types/menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconChevronLeft,
  IconChevronRight,
  IconSunrise,
  IconSun,
  IconMoon,
  IconEdit
} from '@tabler/icons-react';
import { format, addWeeks, subWeeks, startOfWeek, addDays } from 'date-fns';
import { uz } from 'date-fns/locale';

interface MenuCalendarViewProps {
  onEditMenu: (date: string) => void;
}

const dayNames = [
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba',
  'Yakshanba'
];

export default function MenuCalendarView({
  onEditMenu
}: MenuCalendarViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate the week start date based on offset
  const currentWeekStart = startOfWeek(addWeeks(new Date(), weekOffset), {
    weekStartsOn: 1
  });
  const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
  const weekEndStr = format(addDays(currentWeekStart, 6), 'yyyy-MM-dd');

  // Build the API endpoint based on offset
  const endpoint =
    weekOffset === 0
      ? 'meal-orders/menu/week/'
      : weekOffset === 1
        ? 'meal-orders/menu/next-week/'
        : `meal-orders/menu/?start_date=${weekStartStr}&end_date=${weekEndStr}`;

  const { data, isPending, error } = useApiQuery<
    WeekMenuResponse | WeeklyMenu[]
  >(endpoint);

  const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);
  const handleCurrentWeek = () => setWeekOffset(0);

  // Normalize data - the /week/ and /next-week/ endpoints return WeekMenuResponse,
  // while the list endpoint returns an array
  const getMenusArray = (): WeeklyMenu[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return (data as WeekMenuResponse).menus || [];
  };

  const menus = getMenusArray();

  // Create a map of date -> menu for quick lookup
  const menuByDate = new Map<string, WeeklyMenu>();
  menus.forEach((menu) => {
    menuByDate.set(menu.menu_date, menu);
  });

  // Generate the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      dayName: dayNames[i],
      displayDate: format(date, 'd MMM', { locale: uz }),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    };
  });

  const getMenuStatus = (
    menu: WeeklyMenu | undefined
  ): 'full' | 'partial' | 'empty' => {
    if (!menu) return 'empty';
    const hasDishes = [
      menu.breakfast_dish,
      menu.lunch_dish,
      menu.dinner_dish
    ].filter(Boolean);
    if (hasDishes.length === 3) return 'full';
    if (hasDishes.length > 0) return 'partial';
    return 'empty';
  };

  const getStatusColor = (status: 'full' | 'partial' | 'empty') => {
    switch (status) {
      case 'full':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
      case 'partial':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      default:
        return 'border-muted bg-muted/20';
    }
  };

  if (error) {
    return (
      <div className='text-destructive py-8 text-center'>
        Xatolik: {error.message}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Week Navigation */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' onClick={handlePrevWeek}>
            <IconChevronLeft className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='icon' onClick={handleNextWeek}>
            <IconChevronRight className='h-4 w-4' />
          </Button>
          {weekOffset !== 0 && (
            <Button variant='ghost' size='sm' onClick={handleCurrentWeek}>
              Bugun
            </Button>
          )}
        </div>
        <div className='text-lg font-semibold'>
          {format(currentWeekStart, 'd MMM', { locale: uz })} -{' '}
          {format(addDays(currentWeekStart, 6), 'd MMM yyyy', { locale: uz })}
        </div>
      </div>

      {/* Week Grid */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-7'>
        {isPending
          ? weekDays.map((day) => (
              <Card key={day.date} className='border-2'>
                <CardContent className='space-y-3 p-4'>
                  <Skeleton className='h-5 w-20' />
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-16 w-full' />
                </CardContent>
              </Card>
            ))
          : weekDays.map((day) => {
              const menu = menuByDate.get(day.date);
              const status = getMenuStatus(menu);

              return (
                <Card
                  key={day.date}
                  className={`cursor-pointer border-2 transition-all hover:shadow-md ${getStatusColor(status)} ${day.isToday ? 'ring-primary ring-2' : ''}`}
                  onClick={() => onEditMenu(day.date)}
                >
                  <CardContent className='space-y-3 p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-semibold'>{day.dayName}</div>
                        <div className='text-muted-foreground text-sm'>
                          {day.displayDate}
                        </div>
                      </div>
                      {day.isToday && (
                        <Badge variant='default' className='text-xs'>
                          Bugun
                        </Badge>
                      )}
                    </div>

                    <div className='min-h-[100px] space-y-2'>
                      <div className='flex items-start gap-2'>
                        <IconSunrise className='mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500' />
                        <span className='truncate text-sm'>
                          {menu?.breakfast_dish || (
                            <span className='text-muted-foreground italic'>
                              -
                            </span>
                          )}
                        </span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <IconSun className='mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500' />
                        <span className='truncate text-sm'>
                          {menu?.lunch_dish || (
                            <span className='text-muted-foreground italic'>
                              -
                            </span>
                          )}
                        </span>
                      </div>
                      <div className='flex items-start gap-2'>
                        <IconMoon className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500' />
                        <span className='truncate text-sm'>
                          {menu?.dinner_dish || (
                            <span className='text-muted-foreground italic'>
                              -
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMenu(day.date);
                        }}
                      >
                        <IconEdit className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Legend */}
      <div className='text-muted-foreground flex items-center gap-6 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='h-4 w-4 rounded border-2 border-green-500 bg-green-50' />
          <span>Barcha ovqatlar</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-4 w-4 rounded border-2 border-yellow-500 bg-yellow-50' />
          <span>Qisman</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='border-muted bg-muted/20 h-4 w-4 rounded border-2' />
          <span>Bo'sh</span>
        </div>
      </div>
    </div>
  );
}
