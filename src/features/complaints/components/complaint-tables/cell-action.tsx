'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ComplaintRead } from '@/types/complaints';
import { IconDotsVertical, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  data: ComplaintRead;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/dashboard/complaints/${data.id}`);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Menyu ochish</span>
          <IconDotsVertical className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Amallar</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleViewDetails}>
          <IconEye className='mr-2 h-4 w-4' /> Batafsil ko'rish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
