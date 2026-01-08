'use client';

import { useState } from 'react';
import { useApiQuery } from '@/lib/api';
import { StudentsWhoOrderedResponse } from '@/types/orders';
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
import { IconSearch, IconUser, IconUsers } from '@tabler/icons-react';

const mealTypeOptions = [
  { value: 'BREAKFAST', label: 'Nonushta' },
  { value: 'LUNCH', label: 'Tushlik' },
  { value: 'DINNER', label: 'Kechki ovqat' }
];

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: 'Nonushta',
  LUNCH: 'Tushlik',
  DINNER: 'Kechki ovqat'
};

export default function StudentsWhoOrderedPage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState('LUNCH');
  const [studentType, setStudentType] = useState('all');
  const [course, setCourse] = useState('');
  const [searchParams, setSearchParams] = useState({
    date,
    mealType,
    studentType,
    course
  });

  const params = new URLSearchParams({
    date: searchParams.date,
    meal_type: searchParams.mealType,
    ...(searchParams.studentType !== 'all' && {
      student_type: searchParams.studentType
    }),
    ...(searchParams.course && { course: searchParams.course })
  }).toString();

  const { data, isPending, error } = useApiQuery<StudentsWhoOrderedResponse>(
    `meal-orders/orders/students-who-ordered/?${params}`,
    { enabled: !!searchParams.date && !!searchParams.mealType }
  );

  const handleSearch = () => {
    setSearchParams({ date, mealType, studentType, course });
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Buyurtma bergan talabalar</CardTitle>
          <CardDescription>
            Muayyan sana va ovqat turi uchun buyurtma bergan talabalar
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
              <Label htmlFor='studentType'>Talaba turi</Label>
              <Select value={studentType} onValueChange={setStudentType}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Talaba turini tanlang' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Barchasi</SelectItem>
                  <SelectItem value='SCHOLARSHIP'>Grant</SelectItem>
                  <SelectItem value='CONTRACT'>Kontrakt</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='course'>Kurs</Label>
              <Input
                id='course'
                type='number'
                placeholder='1-4'
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className='w-[100px]'
                min={1}
                max={4}
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
              <IconUsers className='h-5 w-5 text-blue-500' />
              Jami: {data.total_count} ta talaba
            </CardTitle>
            <CardDescription>
              {format(new Date(data.date), 'dd.MM.yyyy')} -{' '}
              {mealTypeLabels[data.meal_type] || data.meal_type}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.students.length === 0 ? (
              <p className='text-muted-foreground py-8 text-center'>
                Buyurtma bergan talabalar topilmadi
              </p>
            ) : (
              <div className='divide-y'>
                {data.students.map((item) => (
                  <div
                    key={item.order_id}
                    className='flex items-center gap-4 py-4'
                  >
                    <div className='flex-shrink-0'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                        <IconUser className='h-6 w-6 text-blue-600' />
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
                      <Badge variant='secondary'>
                        {item.student.student_type}
                      </Badge>
                    </div>
                    <div className='text-muted-foreground text-sm'>
                      {format(new Date(item.ordered_at), 'HH:mm')}
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
