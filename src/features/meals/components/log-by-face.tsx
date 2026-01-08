'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useApiMutation } from '@/lib/api';
import { FaceMealLogResponse, MealTypeEnum } from '@/types/meals';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  IconUpload,
  IconCheck,
  IconX,
  IconUser,
  IconLoader2
} from '@tabler/icons-react';
import Image from 'next/image';

const mealTypeOptions = [
  { value: 'BREAKFAST', label: 'Nonushta' },
  { value: 'LUNCH', label: 'Tushlik' },
  { value: 'DINNER', label: 'Kechki ovqat' }
];

export default function LogByFacePage() {
  const [mealType, setMealType] = useState<MealTypeEnum>('LUNCH');
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<FaceMealLogResponse | null>(null);

  const { mutate: logMeal, isPending } = useApiMutation<
    FaceMealLogResponse,
    FormData
  >('meals/log-by-face/', 'POST', {
    onSuccess: (data) => {
      setResult(data);
      if (data.success) {
        toast.success(
          data.message || 'Ovqatlanish muvaffaqiyatli qayd etildi!'
        );
      } else {
        toast.error(data.message || 'Xatolik yuz berdi');
      }
    },
    onError: (error) => {
      toast.error(`Xatolik: ${error.message}`);
      setResult(null);
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error('Iltimos, rasm tanlang');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('meal_type', mealType);

    logMeal(formData);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className='mx-auto max-w-2xl space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          Yuz orqali ovqatlanish
        </h2>
        <p className='text-muted-foreground'>
          Talabaning rasmini yuklang va ovqatlanishni qayd eting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ovqat turini tanlang</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={mealType}
            onValueChange={(v) => setMealType(v as MealTypeEnum)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Ovqat turini tanlang' />
            </SelectTrigger>
            <SelectContent>
              {mealTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rasm yuklash</CardTitle>
          <CardDescription>
            Talabaning yuzini ko'rsatadigan rasm yuklang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'} `}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className='flex flex-col items-center gap-4'>
                <Image
                  src={preview}
                  alt='Preview'
                  width={200}
                  height={200}
                  className='max-h-[200px] w-auto rounded-lg object-cover'
                />
                <p className='text-muted-foreground text-sm'>
                  Boshqa rasm yuklash uchun bosing yoki tashlang
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <IconUpload className='text-muted-foreground h-10 w-10' />
                <p className='font-medium'>
                  Rasm yuklash uchun bosing yoki bu yerga tashlang
                </p>
                <p className='text-muted-foreground text-sm'>
                  PNG, JPG, WEBP formatlarida
                </p>
              </div>
            )}
          </div>

          <div className='mt-4 flex gap-2'>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || isPending}
              className='flex-1'
            >
              {isPending ? (
                <>
                  <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <IconCheck className='mr-2 h-4 w-4' />
                  Qayd etish
                </>
              )}
            </Button>
            {selectedFile && (
              <Button variant='outline' onClick={handleReset}>
                <IconX className='mr-2 h-4 w-4' />
                Tozalash
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Alert variant={result.success ? 'default' : 'destructive'}>
          {result.success ? (
            <IconCheck className='h-4 w-4' />
          ) : (
            <IconX className='h-4 w-4' />
          )}
          <AlertTitle>
            {result.success ? 'Muvaffaqiyatli!' : 'Xatolik!'}
          </AlertTitle>
          <AlertDescription className='mt-2'>
            {result.message}
            {result.student && (
              <div className='bg-muted mt-4 flex items-center gap-4 rounded-lg p-4'>
                {result.student.image_url ? (
                  <Image
                    src={result.student.image_url}
                    alt={result.student.full_name}
                    width={64}
                    height={64}
                    className='rounded-full object-cover'
                  />
                ) : (
                  <div className='bg-background flex h-16 w-16 items-center justify-center rounded-full'>
                    <IconUser className='text-muted-foreground h-8 w-8' />
                  </div>
                )}
                <div>
                  <p className='font-medium'>{result.student.full_name}</p>
                  <p className='text-muted-foreground text-sm'>
                    {result.student.pinfl}
                  </p>
                  <div className='mt-1 flex gap-2'>
                    <Badge variant='outline'>
                      {result.student.course}-kurs
                    </Badge>
                    <Badge>{result.student.student_type}</Badge>
                  </div>
                </div>
              </div>
            )}
            {result.similarity_score !== undefined && (
              <p className='mt-2 text-sm'>
                O'xshashlik darajasi:{' '}
                {(result.similarity_score * 100).toFixed(1)}%
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
