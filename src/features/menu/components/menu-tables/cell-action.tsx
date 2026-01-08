'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import { WeeklyMenu } from '@/types/menu';
import { useApiMutation } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconLoader2
} from '@tabler/icons-react';

interface CellActionProps {
  data: WeeklyMenu;
  onEdit: (date: string) => void;
}

export const CellAction: React.FC<CellActionProps> = ({ data, onEdit }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useApiMutation<void, void>(
    `meal-orders/menu/${data.menu_date}/`,
    'DELETE',
    {
      onSuccess: () => {
        toast.success("Menyu muvaffaqiyatli o'chirildi!");
        queryClient.invalidateQueries({ queryKey: ['meal-orders/menu'] });
        setShowDeleteDialog(false);
      },
      onError: (error) => {
        toast.error(`Xatolik: ${error.message}`);
      }
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Menyu ochish</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Amallar</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(data.menu_date)}>
            <IconEdit className='mr-2 h-4 w-4' /> Tahrirlash
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className='text-destructive focus:text-destructive'
          >
            <IconTrash className='mr-2 h-4 w-4' /> O'chirish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Menyuni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Haqiqatan ham {data.menu_date} sanasidagi menyuni
              o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteMutation.isPending ? (
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
};
