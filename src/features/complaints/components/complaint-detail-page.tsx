'use client';

import { useState } from 'react';
import { useApiQuery, useApiMutation } from '@/lib/api';
import {
  ComplaintRead,
  ComplaintStatusEnum,
  ComplaintStatusUpdate
} from '@/types/complaints';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
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
import { IconLoader2, IconArrowLeft } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface ComplaintDetailPageProps {
  complaintId: string;
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

export default function ComplaintDetailPage({
  complaintId
}: ComplaintDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: complaint,
    isPending: isLoading,
    error
  } = useApiQuery<ComplaintRead>(`meal-orders/complaints/${complaintId}/`);

  const [status, setStatus] = useState<ComplaintStatusEnum | null>(null);
  const [adminResponse, setAdminResponse] = useState('');

  // Initialize form values when complaint data loads
  if (complaint && status === null) {
    setStatus(complaint.status);
    setAdminResponse(complaint.admin_response || '');
  }

  const { mutate: updateStatus, isPending: isUpdating } = useApiMutation<
    ComplaintRead,
    ComplaintStatusUpdate
  >(`meal-orders/complaints/${complaintId}/update-status/`, 'PATCH', {
    onSuccess: () => {
      toast.success('Shikoyat holati muvaffaqiyatli yangilandi!');
      queryClient.invalidateQueries({ queryKey: ['meal-orders/complaints'] });
      queryClient.invalidateQueries({
        queryKey: [`meal-orders/complaints/${complaintId}/`]
      });
    },
    onError: (error) => {
      toast.error(`Xatolik: ${error.message}`);
    }
  });

  const handleSubmit = () => {
    if (!status) return;
    updateStatus({
      status,
      admin_response: adminResponse || undefined
    });
  };

  if (isLoading) {
    return (
      <div className='container mx-auto p-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-32 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className='container mx-auto p-6'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-destructive text-center'>
              Xatolik yuz berdi: {error?.message || 'Shikoyat topilmadi'}
            </p>
            <div className='mt-4 flex justify-center'>
              <Button
                variant='outline'
                onClick={() => router.push('/dashboard/complaints')}
              >
                <IconArrowLeft className='mr-2 h-4 w-4' />
                Orqaga qaytish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <Button
          variant='outline'
          onClick={() => router.push('/dashboard/complaints')}
        >
          <IconArrowLeft className='mr-2 h-4 w-4' />
          Orqaga qaytish
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Complaint Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Shikoyat #{complaint.id}</CardTitle>
            <CardDescription>
              Yuborilgan sana:{' '}
              {format(new Date(complaint.meal_date), 'dd.MM.yyyy HH:mm')}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Student Info */}
            <div className='bg-muted rounded-lg p-4'>
              <h4 className='mb-2 font-medium'>Talaba ma'lumotlari</h4>
              <p className='font-semibold'>
                {complaint.student.first_name} {complaint.student.last_name}
              </p>
              <p className='text-muted-foreground text-sm'>
                PINFL: {complaint.student.pinfl}
              </p>
              <p className='text-muted-foreground text-sm'>
                {complaint.student.course}-kurs
              </p>
              <Badge variant='outline' className='mt-2'>
                {complaint.student.student_type === 'SCHOLARSHIP'
                  ? 'Grant'
                  : 'Kontrakt'}
              </Badge>
            </div>

            {/* Meal Info */}
            <div className='flex gap-4 text-sm'>
              <div>
                <span className='text-muted-foreground'>Ovqat turi: </span>
                <Badge variant='outline'>{complaint.meal_type_display}</Badge>
              </div>
            </div>

            {/* Complaint Text */}
            <div className='space-y-2'>
              <h4 className='font-medium'>Shikoyat matni</h4>
              <p className='bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap'>
                {complaint.complaint_text}
              </p>
            </div>

            {/* Complaint Image */}
            {complaint.image && (
              <div className='space-y-2'>
                <h4 className='font-medium'>Rasm</h4>
                <Image
                  src={complaint.image}
                  alt='Shikoyat rasmi'
                  width={400}
                  height={300}
                  className='rounded-lg object-cover'
                />
              </div>
            )}

            {/* Current Status */}
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>
                Joriy holat:
              </span>
              <Badge variant={statusConfig[complaint.status].variant}>
                {statusConfig[complaint.status].label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status Update Card */}
        <Card>
          <CardHeader>
            <CardTitle>Holatni yangilash</CardTitle>
            <CardDescription>
              Shikoyat holati va javobni yangilash
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Status Update */}
            <div className='space-y-2'>
              <Label htmlFor='status'>Yangi holat</Label>
              <Select
                value={status || ''}
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
                rows={6}
              />
            </div>

            {/* Previous Admin Response */}
            {complaint.admin_response && (
              <div className='space-y-2'>
                <h4 className='text-sm font-medium'>Oldingi javob</h4>
                <p className='bg-muted rounded-lg p-3 text-sm'>
                  {complaint.admin_response}
                </p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isUpdating}
              className='w-full'
            >
              {isUpdating ? (
                <>
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saqlanmoqda...
                </>
              ) : (
                'Saqlash'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
