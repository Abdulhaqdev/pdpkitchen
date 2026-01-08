'use client';

import { useState } from 'react';
import { useApiQuery } from '@/lib/api';
import { PendingMealsResponse } from '@/types/orders';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { IconSearch, IconUser, IconAlertTriangle } from '@tabler/icons-react';

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

export default function PendingMealsPage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState('all');
  const [searchParams, setSearchParams] = useState({ date, mealType });

  const params = new URLSearchParams({
    date: searchParams.date,
    ...(searchParams.mealType !== 'all' && { meal_type: searchParams.mealType })
  }).toString();

  const { data, isPending, error } = useApiQuery<PendingMealsResponse>(
    `meal-orders/orders/pending-meals/?${params}`,
    { enabled: !!searchParams.date }
  );

  const handleSearch = () => {
    setSearchParams({ date, mealType });
  };

  return (
    <div className='space-y-6'>
      <Alert variant='destructive' className='mb-4'>
        <IconAlertTriangle className='h-4 w-4' />
        <AlertTitle>Ogohlantirish</AlertTitle>
        <AlertDescription>
          Quyidagi talabalar buyurtma bergan lekin ovqatlanmagan. Ularga
          tushuntirish ishlari olib boriladi yoki jarima qo'yiladi.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Buyurtma bergan lekin ovqatlanmaganlar</CardTitle>
          <CardDescription>
            Buyurtma bergan lekin ovqat olmagan talabalar ro'yxati
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
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='h-20' />
              ))}
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
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconAlertTriangle className='text-destructive h-5 w-5' />
              Ovqatlanmaganlar: {data.total_pending} ta
            </CardTitle>
            <CardDescription>
              {format(new Date(data.date), 'dd.MM.yyyy')} sanasida buyurtma
              bergan lekin ovqat olmagan talabalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.pending_meals.length === 0 ? (
              <p className='text-muted-foreground py-8 text-center'>
                Buyurtma bergan lekin ovqatlanmagan talabalar topilmadi
              </p>
            ) : (
              <div className='divide-y'>
                {data.pending_meals.map((item) => (
                  <div
                    key={item.order_id}
                    className='hover:bg-muted/50 flex items-center gap-4 rounded-lg px-2 py-4'
                  >
                    <div className='flex-shrink-0'>
                      <div className='bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full'>
                        <IconUser className='text-destructive h-6 w-6' />
                      </div>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-medium'>
                        {item.student.first_name} {item.student.last_name}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {item.student.pinfl}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline'>
                        {item.student.course}-kurs
                      </Badge>
                      <Badge variant='outline'>
                        {item.student.student_type === 'SCHOLARSHIP'
                          ? 'Grant'
                          : 'Kontrakt'}
                      </Badge>
                    </div>
                    <div className='flex flex-wrap gap-1'>
                      {item.pending_meal_types.map((type) => (
                        <Badge key={type} variant='destructive'>
                          {mealTypeLabels[type] || type}
                        </Badge>
                      ))}
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      Buyurtma: {format(new Date(item.ordered_at), 'HH:mm')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
