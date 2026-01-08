'use client';

import { useEffect, useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/api';
import { WeeklyMenu, WeeklyMenuRequest } from '@/types/menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import {
  IconLoader2,
  IconSunrise,
  IconSun,
  IconMoon,
  IconTrash
} from '@tabler/icons-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface MenuFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  menuDate: string | null; // If null, create new; if set, edit existing
}

export default function MenuFormDialog({
  isOpen,
  onClose,
  menuDate
}: MenuFormDialogProps) {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<WeeklyMenuRequest>({
    menu_date: menuDate || format(new Date(), 'yyyy-MM-dd'),
    breakfast_dish: '',
    lunch_dish: '',
    dinner_dish: ''
  });

  const isEditMode = !!menuDate;

  // Fetch existing menu if editing
  const { data: existingMenu, isPending: isLoadingMenu } =
    useApiQuery<WeeklyMenu>(`meal-orders/menu/${menuDate}/`, {
      enabled: isOpen && isEditMode
    });

  // Update form when existing menu loads
  useEffect(() => {
    if (existingMenu) {
      setFormData({
        menu_date: existingMenu.menu_date,
        breakfast_dish: existingMenu.breakfast_dish || '',
        lunch_dish: existingMenu.lunch_dish || '',
        dinner_dish: existingMenu.dinner_dish || ''
      });
    } else if (!isEditMode && menuDate === null) {
      setFormData({
        menu_date: format(new Date(), 'yyyy-MM-dd'),
        breakfast_dish: '',
        lunch_dish: '',
        dinner_dish: ''
      });
    } else if (menuDate) {
      setFormData({
        menu_date: menuDate,
        breakfast_dish: '',
        lunch_dish: '',
        dinner_dish: ''
      });
    }
  }, [existingMenu, menuDate, isEditMode]);

  // Create mutation
  const createMutation = useApiMutation<WeeklyMenu, WeeklyMenuRequest>(
    'meal-orders/menu/',
    'POST',
    {
      onSuccess: () => {
        toast.success('Menyu muvaffaqiyatli yaratildi!');
        queryClient.invalidateQueries({ queryKey: ['meal-orders/menu'] });
        onClose();
      },
      onError: (error) => {
        toast.error(`Xatolik: ${error.message}`);
      }
    }
  );

  // Update mutation
  const updateMutation = useApiMutation<WeeklyMenu, WeeklyMenuRequest>(
    `meal-orders/menu/${menuDate}/`,
    'PUT',
    {
      onSuccess: () => {
        toast.success('Menyu muvaffaqiyatli yangilandi!');
        queryClient.invalidateQueries({ queryKey: ['meal-orders/menu'] });
        onClose();
      },
      onError: (error) => {
        toast.error(`Xatolik: ${error.message}`);
      }
    }
  );

  // Delete mutation
  const deleteMutation = useApiMutation<void, void>(
    `meal-orders/menu/${menuDate}/`,
    'DELETE',
    {
      onSuccess: () => {
        toast.success("Menyu muvaffaqiyatli o'chirildi!");
        queryClient.invalidateQueries({ queryKey: ['meal-orders/menu'] });
        setShowDeleteConfirm(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`Xatolik: ${error.message}`);
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one dish is provided
    if (
      !formData.breakfast_dish &&
      !formData.lunch_dish &&
      !formData.dinner_dish
    ) {
      toast.error('Kamida bitta ovqat nomi kiriting');
      return;
    }

    const payload: WeeklyMenuRequest = {
      menu_date: formData.menu_date,
      breakfast_dish: formData.breakfast_dish || null,
      lunch_dish: formData.lunch_dish || null,
      dinner_dish: formData.dinner_dish || null
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const getFormattedDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'EEEE, d MMMM yyyy', { locale: uz });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Menyuni tahrirlash' : 'Yangi menyu yaratish'}
            </DialogTitle>
            <DialogDescription>
              {menuDate
                ? getFormattedDate(menuDate)
                : 'Kunlik ovqat menyusini kiriting'}
            </DialogDescription>
          </DialogHeader>

          {isLoadingMenu && isEditMode ? (
            <div className='flex items-center justify-center py-8'>
              <IconLoader2 className='text-primary h-8 w-8 animate-spin' />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-4'>
              {!isEditMode && (
                <div className='space-y-2'>
                  <Label htmlFor='menu_date'>Sana</Label>
                  <Input
                    id='menu_date'
                    type='date'
                    value={formData.menu_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        menu_date: e.target.value
                      }))
                    }
                    required
                  />
                </div>
              )}

              <div className='space-y-2'>
                <Label
                  htmlFor='breakfast_dish'
                  className='flex items-center gap-2'
                >
                  <IconSunrise className='h-4 w-4 text-orange-500' />
                  Nonushta
                </Label>
                <Input
                  id='breakfast_dish'
                  placeholder='Nonushta taomi nomi'
                  value={formData.breakfast_dish || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      breakfast_dish: e.target.value
                    }))
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='lunch_dish' className='flex items-center gap-2'>
                  <IconSun className='h-4 w-4 text-yellow-500' />
                  Tushlik
                </Label>
                <Input
                  id='lunch_dish'
                  placeholder='Tushlik taomi nomi'
                  value={formData.lunch_dish || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lunch_dish: e.target.value
                    }))
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='dinner_dish'
                  className='flex items-center gap-2'
                >
                  <IconMoon className='h-4 w-4 text-blue-500' />
                  Kechki ovqat
                </Label>
                <Input
                  id='dinner_dish'
                  placeholder='Kechki ovqat taomi nomi'
                  value={formData.dinner_dish || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dinner_dish: e.target.value
                    }))
                  }
                />
              </div>

              <DialogFooter className='flex justify-between sm:justify-between'>
                {isEditMode && existingMenu && (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isPending || isDeleting}
                  >
                    <IconTrash className='mr-2 h-4 w-4' />
                    O'chirish
                  </Button>
                )}
                <div className='flex gap-2'>
                  <Button type='button' variant='outline' onClick={onClose}>
                    Bekor qilish
                  </Button>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? (
                      <>
                        <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                        Saqlanmoqda...
                      </>
                    ) : (
                      'Saqlash'
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Menyuni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham bu menyuni o'chirmoqchimisiz? Bu amalni qaytarib
              bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? (
                <>
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  O'chirilmoqda...
                </>
              ) : (
                "O'chirish"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
