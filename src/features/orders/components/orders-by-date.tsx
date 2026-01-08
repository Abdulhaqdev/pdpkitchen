'use client';

import { useState } from 'react';
import { useApiQuery } from '@/lib/api';
import { OrderStatistics } from '@/types/orders';
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
import { IconSearch, IconUser, IconCheck, IconX } from '@tabler/icons-react';

const mealTypeOptions = [
  { value: 'all', label: 'Barchasi' },
  { value: 'BREAKFAST', label: 'Nonushta' },
  { value: 'LUNCH', label: 'Tushlik' },
  { value: 'DINNER', label: 'Kechki ovqat' }
];

const studentTypeOptions = [
  { value: 'all', label: 'Barchasi' },
  { value: 'SCHOLARSHIP', label: 'Grant' },
  { value: 'CONTRACT', label: 'Kontrakt' }
];

export default function OrdersByDatePage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [mealType, setMealType] = useState('all');
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
    ...(searchParams.mealType !== 'all' && {
      meal_type: searchParams.mealType
    }),
    ...(searchParams.studentType !== 'all' && {
      student_type: searchParams.studentType
    }),
    ...(searchParams.course && { course: searchParams.course })
  }).toString();

  const { data, isPending, error } = useApiQuery<OrderStatistics>(
    `meal-orders/orders/by-date/?${params}`,
    { enabled: !!searchParams.date }
  );

  const handleSearch = () => {
    setSearchParams({ date, mealType, studentType, course });
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Sana bo'yicha buyurtmalar</CardTitle>
          <CardDescription>
            Muayyan sana uchun buyurtmalarni ko'ring
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
                  {studentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
                <CardDescription>Jami buyurtmalar</CardDescription>
                <CardTitle className='text-3xl'>
                  {data.total_students_ordered}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Nonushta</CardDescription>
                <CardTitle className='text-3xl'>
                  {data.breakfast_count}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Tushlik</CardDescription>
                <CardTitle className='text-3xl'>{data.lunch_count}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className='pb-2'>
                <CardDescription>Kechki ovqat</CardDescription>
                <CardTitle className='text-3xl'>{data.dinner_count}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buyurtmalar ro'yxati</CardTitle>
              <CardDescription>
                {format(new Date(data.date), 'dd.MM.yyyy')} sanasidagi
                buyurtmalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.orders.length === 0 ? (
                <p className='text-muted-foreground py-8 text-center'>
                  Bu sana uchun buyurtmalar topilmadi
                </p>
              ) : (
                <div className='divide-y'>
                  {data.orders.map((order) => (
                    <div
                      key={order.id}
                      className='flex items-center gap-4 py-4'
                    >
                      <div className='flex-shrink-0'>
                        <div className='bg-muted flex h-12 w-12 items-center justify-center rounded-full'>
                          <IconUser className='text-muted-foreground h-6 w-6' />
                        </div>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate font-medium'>
                          {order.student.first_name} {order.student.last_name}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {order.student.pinfl}
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline'>
                          {order.student.course}-kurs
                        </Badge>
                        <Badge variant='secondary'>
                          {order.student.student_type}
                        </Badge>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div
                          className='flex items-center gap-1'
                          title='Nonushta'
                        >
                          {order.breakfast_ordered ? (
                            <IconCheck className='h-4 w-4 text-green-500' />
                          ) : (
                            <IconX className='text-muted-foreground h-4 w-4' />
                          )}
                          <span className='text-xs'>N</span>
                        </div>
                        <div
                          className='flex items-center gap-1'
                          title='Tushlik'
                        >
                          {order.lunch_ordered ? (
                            <IconCheck className='h-4 w-4 text-green-500' />
                          ) : (
                            <IconX className='text-muted-foreground h-4 w-4' />
                          )}
                          <span className='text-xs'>T</span>
                        </div>
                        <div
                          className='flex items-center gap-1'
                          title='Kechki ovqat'
                        >
                          {order.dinner_ordered ? (
                            <IconCheck className='h-4 w-4 text-green-500' />
                          ) : (
                            <IconX className='text-muted-foreground h-4 w-4' />
                          )}
                          <span className='text-xs'>K</span>
                        </div>
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
