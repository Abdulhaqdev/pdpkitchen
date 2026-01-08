'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconCalendar, IconList, IconPlus } from '@tabler/icons-react';
import MenuCalendarView from './menu-calendar-view';
import MenuListView from './menu-list-view';
import MenuFormDialog from './menu-form-dialog';

export default function MenuListing() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleAddMenu = () => {
    setSelectedDate(null);
    setIsDialogOpen(true);
  };

  const handleEditMenu = (date: string) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Haftalik Menyu</CardTitle>
            <CardDescription>Kunlik ovqat menyusini boshqarish</CardDescription>
          </div>
          <Button onClick={handleAddMenu}>
            <IconPlus className='mr-2 h-4 w-4' />
            Menyu qo'shish
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='calendar' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='calendar' className='flex items-center gap-2'>
                <IconCalendar className='h-4 w-4' />
                Kalendar
              </TabsTrigger>
              <TabsTrigger value='list' className='flex items-center gap-2'>
                <IconList className='h-4 w-4' />
                Ro'yxat
              </TabsTrigger>
            </TabsList>
            <TabsContent value='calendar'>
              <MenuCalendarView onEditMenu={handleEditMenu} />
            </TabsContent>
            <TabsContent value='list'>
              <MenuListView onEditMenu={handleEditMenu} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <MenuFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        menuDate={selectedDate}
      />
    </div>
  );
}
