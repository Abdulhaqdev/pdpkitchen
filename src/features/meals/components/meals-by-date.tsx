'use client';

import { useState } from 'react';
import { useApiQuery } from '@/lib/api';
import { MealsByDateResponse, MealTypeEnum } from '@/types/meals';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { IconSearch, IconUser } from '@tabler/icons-react';
import Image from 'next/image';

const mealTypeOptions = [
  { value: 'all', label: 'Barchasi' },
  { value: 'BREAKFAST', label: 'Nonushta' },
  { value: 'LUNCH', label: 'Tushlik' },
  { value: 'DINNER', label: 'Kechki ovqat' }
];

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: 'Nonushta',
  LUNCH: 'Tushlik',
  DINNER: 'Kechki ovqat'
};

export default function MealsByDatePage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState<string>('all');
  const [pinfl, setPinfl] = useState('');
  const [searchParams, setSearchParams] = useState({ date, mealType, pinfl });

  const params = new URLSearchParams({
    date: searchParams.date,
    ...(searchParams.mealType !== 'all' && {
      meal_type: searchParams.mealType
    }),
    ...(searchParams.pinfl && { pinfl: searchParams.pinfl })
  }).toString();

  const { data, isPending, error, refetch } = useApiQuery<MealsByDateResponse>(
    `meals/by-date/?${params}`,
    { enabled: !!searchParams.date }
  );

  const handleSearch = () => {
    setSearchParams({ date, mealType, pinfl });
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Sana bo'yicha qidirish</CardTitle>
          <CardDescription>
            Muayyan sana uchun ovqatlanish ma'lumotlarini ko'ring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap items-end gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='date'>Sana</Label>
              <Input
                id='date'
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='w-[180px]'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='mealType'>Ovqat turi</Label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Ovqat turini tanlang' />
                </SelectTrigger>
                <SelectContent>
                  {mealTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pinfl'>PINFL</Label>
              <Input
                id='pinfl'
                placeholder='PINFL kiriting'
                value={pinfl}
                onChange={(e) => setPinfl(e.target.value)}
                className='w-[180px]'
              />
            </div>
            <Button onClick={handleSearch}>
              <IconSearch className='mr-2 h-4 w-4' />
              Qidirish
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <Card>
          <CardContent className='pt-6'>
            <div className='space-y-4'>
              <Skeleton className='h-8 w-[200px]' />
              <div className='grid gap-4 md:grid-cols-4'>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className='h-24' />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className='pt-6'>
            <p className='text-destructive'>Xatolik: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          <div className='grid gap-4 md:grid-cols-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Jami</CardDescription>
                <CardTitle className='text-3xl'>{data.total_count}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Nonushta</CardDescription>
                <CardTitle className='text-3xl'>
                  {data.counts_by_type.breakfast}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Tushlik</CardDescription>
                <CardTitle className='text-3xl'>
                  {data.counts_by_type.lunch}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Kechki ovqat</CardDescription>
                <CardTitle className='text-3xl'>
                  {data.counts_by_type.dinner}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ovqatlanganlar ro'yxati</CardTitle>
              <CardDescription>
                {format(new Date(data.date), 'dd.MM.yyyy')} sanasidagi
                ovqatlanishlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.meals.length === 0 ? (
                <p className='text-muted-foreground py-8 text-center'>
                  Bu sana uchun ovqatlanish ma'lumotlari topilmadi
                </p>
              ) : (
                <div className='divide-y'>
                  {data.meals.map((meal) => (
                    <div key={meal.id} className='flex items-center gap-4 py-4'>
                      <div className='flex-shrink-0'>
                        {meal.student.image_url ? (
                          <Image
                            src={meal.student.image_url}
                            alt={meal.student.full_name}
                            width={48}
                            height={48}
                            className='h-12 w-12 rounded-full object-cover'
                          />
                        ) : (
                          <div className='bg-muted flex h-12 w-12 items-center justify-center rounded-full'>
                            <IconUser className='text-muted-foreground h-6 w-6' />
                          </div>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium'>
                          {meal.student.full_name}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {meal.student.pinfl}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline'>
                          {meal.student.course}-kurs
                        </Badge>
                        <Badge>
                          {mealTypeLabels[meal.meal_type] || meal.meal_type}
                        </Badge>
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        {format(new Date(meal.meal_date), 'HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
