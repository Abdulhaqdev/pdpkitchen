'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MealLogList } from '@/types/meals';
import { IconDotsVertical, IconTrash, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApiMutation } from '@/lib/api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface CellActionProps {
  data: MealLogList;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteMeal } = useApiMutation<void, void>(
    `meals/${data.id}/`,
    'DELETE',
    {
      onSuccess: () => {
        toast.success("Ovqat yozuvi muvaffaqiyatli o'chirildi!");
        queryClient.invalidateQueries({ queryKey: ['meals'] });
        setOpen(false);
      },
      onError: (error) => {
        toast.error(`Xatolik: ${error.message}`);
        setOpen(false);
      }
    }
  );

  const onConfirm = async () => {
    setLoading(true);
    deleteMeal();
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Menyu ochish</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Amallar</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/profile/${data.student}`)}
          >
            <IconEye className='mr-2 h-4 w-4' /> Talabani ko'rish
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> O'chirish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
