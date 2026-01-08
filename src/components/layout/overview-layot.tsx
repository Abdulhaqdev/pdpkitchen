import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
  CardContent
} from '@/components/ui/card';
import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconUserScan,
  IconToolsKitchen2,
  IconClipboardList,
  IconMessageReport
} from '@tabler/icons-react';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { format, subDays } from 'date-fns';
import { DashboardResponse } from '@/types/dashboard';

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

interface OverViewLayoutProps {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  stats?: RangeOverviewData | null;
  dashboardData?: DashboardResponse | null;
}

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  stats,
  dashboardData
}: OverViewLayoutProps) {
  const getChangeIcon = (change: number) =>
    change >= 0 ? <IconTrendingUp /> : <IconTrendingDown />;
  const getChangeVariant = (change: number) =>
    change >= 0 ? 'default' : 'outline';
  const getChangeText = (change: number) =>
    `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;

  // Fallback values and data extraction
  const dailyData = stats?.daily_breakdown || [];
  const summary = stats?.summary || {
    total_meals: 0,
    unique_students: 0,
    by_meal_type: { breakfast: 0, lunch: 0, dinner: 0 }
  };
  const filters = stats?.filters_applied || {
    student_type: 'SCHOLARSHIP',
    course: 2
  };
  const dateRange = stats?.date_range || {
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
    days: 7
  };

  // Calculate changes (comparing last day with previous day)
  const lastDay = dailyData[dailyData.length - 1] || { total: 0 };
  const prevDay = dailyData[dailyData.length - 2] || { total: 0 };
  const mealsChange = prevDay.total
    ? ((lastDay.total - prevDay.total) / prevDay.total) * 100
    : 0;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Salom, xush kelibsiz 👋
          </h2>
        </div>

        {/* Quick Stats from Consolidated Dashboard API */}
        {dashboardData && (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardDescription>Faol Talabalar</CardDescription>
                <IconUsers className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboardData.students.total_active.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Grant: {dashboardData.students.by_type.scholarship} |
                  Kontrakt: {dashboardData.students.by_type.contract}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardDescription>Yuz bilan</CardDescription>
                <IconUserScan className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboardData.students.with_face_embedding.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {dashboardData.students.total_active > 0
                    ? Math.round(
                        (dashboardData.students.with_face_embedding /
                          dashboardData.students.total_active) *
                          100
                      )
                    : 0}
                  % talabalar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardDescription>Bugungi Ovqatlar</CardDescription>
                <IconToolsKitchen2 className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboardData.meals.today.total.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  N: {dashboardData.meals.today.breakfast} | T:{' '}
                  {dashboardData.meals.today.lunch} | K:{' '}
                  {dashboardData.meals.today.dinner}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardDescription>Ertangi Buyurtmalar</CardDescription>
                <IconClipboardList className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboardData.orders.total_orders.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  N: {dashboardData.orders.breakfast_count} | T:{' '}
                  {dashboardData.orders.lunch_count} | K:{' '}
                  {dashboardData.orders.dinner_count}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardDescription>Kutilayotgan Shikoyatlar</CardDescription>
                <IconMessageReport className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {dashboardData.complaints.pending}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Ko'rilgan: {dashboardData.complaints.reviewed} | Hal:{' '}
                  {dashboardData.complaints.resolved}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className='text-muted-foreground text-sm'>
          Filtrlar: Kurs {filters.course}, Talaba turi: {filters.student_type},{' '}
          {dateRange.start} - {dateRange.end} ({dateRange.days} kun)
        </div>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardDescription>Jami Hisobot</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {summary.total_meals.toLocaleString()} ta ovqat
              </CardTitle>
              <CardAction>
                <Badge variant={getChangeVariant(mealsChange)}>
                  {getChangeIcon(mealsChange)}
                  {getChangeText(Math.round(mealsChange))}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-primary text-2xl font-bold'>
                  {summary.by_meal_type.breakfast}
                </div>
                <div className='text-muted-foreground text-sm'>Nonushta</div>
              </div>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-destructive text-2xl font-bold'>
                  {summary.by_meal_type.lunch}{' '}
                </div>
                <div className='text-muted-foreground text-sm'>Tushlik</div>
              </div>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-warning text-2xl font-bold'>
                  {summary.by_meal_type.dinner}{' '}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Kechki Ovqat
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='text-muted-foreground'>
                {dateRange.start} - {dateRange.end} davrining umumiy
                ko‘rsatkichi
              </div>
            </CardFooter>
          </Card>

          <div className='max-h-[400px] overflow-y-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Jami Ovqatlar</TableHead>
                  <TableHead>Nonushta</TableHead>
                  <TableHead>Tushlik</TableHead>
                  <TableHead>Kechki Ovqat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyData.map((day, index) => {
                  const prevDay = dailyData[index - 1] || { total: 0 };
                  const dayMealsChange = prevDay.total
                    ? ((day.total - prevDay.total) / prevDay.total) * 100
                    : 0;

                  return (
                    <TableRow key={day.date}>
                      <TableCell>{day.date}</TableCell>
                      <TableCell>
                        {day.total.toLocaleString()}
                        <Badge
                          variant={getChangeVariant(dayMealsChange)}
                          className='ml-2'
                        >
                          {getChangeIcon(dayMealsChange)}
                          {getChangeText(Math.round(dayMealsChange))}
                        </Badge>
                      </TableCell>
                      <TableCell>{day.breakfast}</TableCell>
                      <TableCell>{day.lunch}</TableCell>
                      <TableCell>{day.dinner}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4 md:col-span-3'>
            {/* Savdo parallel marshrutlari */}
            {sales}
          </div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
