import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import React from 'react';

type OverviewData = {
  timestamp: string;
  total_active_students: number;
  today: {
    total_meals: number;
    unique_students: number;
    by_meal_type: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    by_student_type: {
      scholarship: number;
      contract: number;
    };
    average_meals_per_student: number;
  };
  this_week: {
    total_meals: number;
    unique_students: number;
    by_meal_type: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    by_student_type: {
      scholarship: number;
      contract: number;
    };
    average_meals_per_student: number;
  };
  this_month: {
    total_meals: number;
    unique_students: number;
    by_meal_type: {
      breakfast: number;
      lunch: number;
      dinner: number;
    };
    by_student_type: {
      scholarship: number;
      contract: number;
    };
    average_meals_per_student: number;
  };
};

interface OverViewLayoutProps {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
  stats?: OverviewData | null;
}

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats,
  stats
}: OverViewLayoutProps) {
  const getChangeIcon = (change: number) =>
    change >= 0 ? <IconTrendingUp /> : <IconTrendingDown />;
  const getChangeVariant = (change: number) =>
    change >= 0 ? 'default' : 'outline';
  const getChangeText = (change: number) =>
    `${change >= 0 ? '+' : ''}${change}%`;

  // Fallback values if stats is not available
  const totalActiveStudents = stats?.total_active_students ?? 0;
  const todayMeals = stats?.today.total_meals ?? 0;
  const newCustomers = stats?.today.unique_students ?? 0; // Using unique_students as a proxy for new customers
  const activeAccounts = stats?.this_month.unique_students ?? 0; // Using monthly unique students as active accounts
  const growthRate = stats?.this_month.average_meals_per_student ?? 0; // Using average meals per student as growth indicator

  // Calculate changes (simplified, adjust based on actual data if available)
  const revenueChange = stats
    ? ((stats.this_month.total_meals - stats.today.total_meals) /
        stats.today.total_meals) *
      100
    : 0;
  const customersChange = stats
    ? ((stats.this_month.unique_students - stats.today.unique_students) /
        stats.today.unique_students) *
      100
    : 0;
  const accountsChange = stats
    ? ((stats.this_month.unique_students - stats.this_week.unique_students) /
        stats.this_week.unique_students) *
      100
    : 0;
  const growthChange = stats
    ? ((stats.this_month.average_meals_per_student -
        stats.this_week.average_meals_per_student) /
        stats.this_week.average_meals_per_student) *
      100
    : 0;

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Total Revenue (Meals)</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {todayMeals.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant={getChangeVariant(revenueChange)}>
                  {getChangeIcon(revenueChange)}
                  {getChangeText(Math.round(revenueChange))}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {revenueChange >= 0
                  ? 'Trending up today'
                  : 'Trending down today'}{' '}
                {getChangeIcon(revenueChange)}
              </div>
              <div className='text-muted-foreground'>Meals served today</div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>New (Unique Students)</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {newCustomers.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant={getChangeVariant(customersChange)}>
                  {getChangeIcon(customersChange)}
                  {getChangeText(Math.round(customersChange))}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {customersChange >= 0 ? 'Up' : 'Down'}{' '}
                {Math.abs(Math.round(customersChange))}% today{' '}
                {getChangeIcon(customersChange)}
              </div>
              <div className='text-muted-foreground'>
                Acquisition needs attention
              </div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>
                Active Accounts (Unique Students)
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {activeAccounts.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant={getChangeVariant(accountsChange)}>
                  {getChangeIcon(accountsChange)}
                  {getChangeText(Math.round(accountsChange))}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Strong user retention {getChangeIcon(accountsChange)}
              </div>
              <div className='text-muted-foreground'>Engagement this month</div>
            </CardFooter>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Growth Rate (Avg Meals/Student)</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {growthRate.toFixed(2)}%
              </CardTitle>
              <CardAction>
                <Badge variant={getChangeVariant(growthChange)}>
                  {getChangeIcon(growthChange)}
                  {getChangeText(Math.round(growthChange))}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Steady performance increase {getChangeIcon(growthChange)}
              </div>
              <div className='text-muted-foreground'>
                Meets growth projections
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4 md:col-span-3'>
            {/* sales parallel routes */}
            {sales}
          </div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
