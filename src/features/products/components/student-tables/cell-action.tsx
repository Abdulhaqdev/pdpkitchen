'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Student } from '@/constants/data';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDeleteStudent } from '@/lib/api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface CellActionProps {
  data: Student;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteStudent } = useDeleteStudent(data.id, {
    onSuccess: () => {
      toast.success('Talaba muvaffaqiyatli o\'chirildi!');
queryClient.invalidateQueries({ queryKey: ['students'] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(`Xatolik: ${error.message}`);
      setOpen(false);
    },
  });

  const onConfirm = async () => {
    setLoading(true);
    deleteStudent();
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
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/profile/${data.id}`)} // Detail sahifasi
          >
            <IconEdit className='mr-2 h-4 w-4' /> View Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/student/${data.id}`)} // Update sahifasi
          >
            <IconEdit className='mr-2 h-4 w-4' /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};