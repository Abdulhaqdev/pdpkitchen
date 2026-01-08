'use client';

import { useState } from 'react';
import { useApiMutation } from '@/lib/api';
import {
  ComplaintRead,
  ComplaintStatusEnum,
  ComplaintStatusUpdate
} from '@/types/complaints';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { IconLoader2 } from '@tabler/icons-react';
import Image from 'next/image';

interface StatusUpdateDialogProps {
  complaint: ComplaintRead;
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: string | null;
}

const statusOptions = [
  { value: 'PENDING', label: 'Kutilmoqda' },
  { value: 'REVIEWED', label: "Ko'rib chiqildi" },
  { value: 'RESOLVED', label: 'Hal qilindi' },
  { value: 'REJECTED', label: 'Rad etildi' }
];

const statusConfig: Record<
  ComplaintStatusEnum,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  PENDING: { label: 'Kutilmoqda', variant: 'secondary' },
  REVIEWED: { label: "Ko'rib chiqildi", variant: 'outline' },
  RESOLVED: { label: 'Hal qilindi', variant: 'default' },
  REJECTED: { label: 'Rad etildi', variant: 'destructive' }
};

export function StatusUpdateDialog({
  complaint,
  isOpen,
  onClose,
  initialStatus
}: StatusUpdateDialogProps) {
  const [status, setStatus] = useState<ComplaintStatusEnum>(
    (initialStatus as ComplaintStatusEnum) || complaint.status
  );
  const [adminResponse, setAdminResponse] = useState(
    complaint.admin_response || ''
  );
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useApiMutation<
    ComplaintRead,
    ComplaintStatusUpdate
  >(`meal-orders/complaints/${complaint.id}/update-status/`, 'PATCH', {
    onSuccess: () => {
      toast.success('Shikoyat holati muvaffaqiyatli yangilandi!');
      queryClient.invalidateQueries({ queryKey: ['meal-orders/complaints'] });
      onClose();
    },
    onError: (error) => {
      toast.error(`Xatolik: ${error.message}`);
    }
  });

  const handleSubmit = () => {
    updateStatus({
      status,
      admin_response: adminResponse || undefined
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Shikoyat #{complaint.id}</DialogTitle>
          <DialogDescription>
            Shikoyat holati va javobni yangilash
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Student Info */}
          <div className='bg-muted rounded-lg p-4'>
            <h4 className='mb-2 font-medium'>Talaba ma'lumotlari</h4>
            <p>
              {complaint.student.first_name} {complaint.student.last_name}
            </p>
            <p className='text-muted-foreground text-sm'>
              PINFL: {complaint.student.pinfl}
            </p>
            <p className='text-muted-foreground text-sm'>
              {complaint.student.course}-kurs
            </p>
          </div>

          {/* Complaint Details */}
          <div className='space-y-2'>
            <h4 className='font-medium'>Shikoyat matni</h4>
            <p className='bg-muted rounded-lg p-3 text-sm'>
              {complaint.complaint_text}
            </p>
          </div>

          {/* Meal Info */}
          <div className='flex gap-4 text-sm'>
            <div>
              <span className='text-muted-foreground'>Ovqat turi: </span>
              <Badge variant='outline'>{complaint.meal_type_display}</Badge>
            </div>
            <div>
              <span className='text-muted-foreground'>Sana: </span>
              {format(new Date(complaint.meal_date), 'dd.MM.yyyy HH:mm')}
            </div>
          </div>

          {/* Complaint Image */}
          {complaint.image && (
            <div className='space-y-2'>
              <h4 className='font-medium'>Rasm</h4>
              <Image
                src={complaint.image}
                alt='Shikoyat rasmi'
                width={300}
                height={200}
                className='rounded-lg object-cover'
              />
            </div>
          )}

          {/* Current Status */}
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>Joriy holat:</span>
            <Badge variant={statusConfig[complaint.status].variant}>
              {statusConfig[complaint.status].label}
            </Badge>
          </div>

          {/* Status Update */}
          <div className='space-y-2'>
            <Label htmlFor='status'>Yangi holat</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ComplaintStatusEnum)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Holatni tanlang' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Admin Response */}
          <div className='space-y-2'>
            <Label htmlFor='adminResponse'>Administrator javobi</Label>
            <Textarea
              id='adminResponse'
              placeholder='Javobingizni kiriting...'
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                Saqlanmoqda...
              </>
            ) : (
              'Saqlash'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
