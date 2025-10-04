'use client';

import { FormFileUpload } from '@/components/forms/form-file-upload';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import { FormTextarea } from '@/components/forms/form-textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Studentpost } from '@/constants/data';
import { useApiMutation } from '@/lib/api';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const formSchema = z.object({
  pinfl: z.string().min(6, { message: 'PINFL kamida 6 ta belgidan iborat bo\'lishi kerak' }).max(14, { message: 'PINFL 14 ta belgidan oshmasligi kerak' }),
  first_name: z.string().min(2, { message: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak' }),
  last_name: z.string().min(2, { message: 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak' }),
  middle_name: z.string().optional(),
  student_type: z.enum(['SCHOLARSHIP', 'CONTRACT'], { message: 'Talaba turi majburiy' }),
  course: z.number().int().min(1, { message: 'Kurs kamida 1 bo\'lishi kerak' }).max(2147483647, { message: 'Kurs haddan tashqari katta' }),
  until_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Noto\'g\'ri sana formati' }),
  is_active: z.string(), // Boolean as string for form compatibility
  image: z
    .any()
    .optional()
    .refine((files) => !files || files?.length === 1, { message: 'Faqat bitta rasm yuklang' })
    .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE, { message: 'Maksimal fayl hajmi 5MB' })
    .refine((files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), { message: '.jpg, .jpeg, .png va .webp fayllar qabul qilinadi' }),
  description: z.string().optional(),
  basis_document_number: z.string().optional(),
  basis_document_file: z
    .any()
    .optional()
    .refine((files) => !files || files?.length === 1, { message: 'Faqat bitta hujjat faylini yuklang' })
    .refine((files) => !files || files?.[0]?.size <= 10 * 1024 * 1024, { message: 'Maksimal fayl hajmi 10MB' })
    .refine((files) => !files || ACCEPTED_DOCUMENT_TYPES.includes(files?.[0]?.type), { message: 'Faqat .pdf, .jpg, .png fayllar qabul qilinadi' }),
});

type FormData = z.infer<typeof formSchema>;
type Accept = { [key: string]: string[] } | string[];

export default function StudentForm({
  initialData,
  pageTitle,
}: {
  initialData: Studentpost | null;
  pageTitle: string;
}) {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          pinfl: initialData.pinfl || '',
          first_name: initialData.first_name || '',
          last_name: initialData.last_name || '',
          middle_name: initialData.middle_name || '',
          student_type: initialData.student_type || 'SCHOLARSHIP',
          course: initialData.course || 1,
          until_date: initialData.until_date || '',
          is_active: initialData.is_active ? 'true' : 'false',
          image: undefined,
          description: initialData.description || '',
          basis_document_number: initialData.basis_document_number || '',
          basis_document_file: undefined,
        }
      : {
          pinfl: '',
          first_name: '',
          last_name: '',
          middle_name: '',
          student_type: 'SCHOLARSHIP',
          course: 1,
          until_date: '',
          is_active: 'true',
          image: undefined,
          description: '',
          basis_document_number: '',
          basis_document_file: undefined,
        },
  });

  const isUpdate = !!initialData;

  const createStudent = useApiMutation<Studentpost, FormData>('students/', 'POST', {
    onSuccess: () => {
      toast.success('Talaba muvaffaqiyatli qo\'shildi!');
      router.push('/dashboard/student');
    },
    onError: (error) => {
      toast.error(error.message || 'Xatolik yuz berdi');
    },
  });

  const updateStudent = useApiMutation<Studentpost, FormData>(
    `students/${initialData?.id}/`,
    'PUT',
    {
      onSuccess: () => {
        toast.success('Talaba muvaffaqiyatli yangilandi!');
        router.push('/dashboard/student');
      },
      onError: (error) => {
        toast.error(error.message || 'Xatolik yuz berdi');
      },
    }
  );

  function onSubmit(values: FormData) {
    const formData = new FormData();
    formData.append('pinfl', values.pinfl);
    formData.append('first_name', values.first_name);
    formData.append('last_name', values.last_name);
    if (values.middle_name) formData.append('middle_name', values.middle_name);
    formData.append('student_type', values.student_type);
    formData.append('course', values.course.toString());
    formData.append('until_date', values.until_date);
    formData.append('is_active', values.is_active);
    if (values.image?.[0]) formData.append('image', values.image[0]);
    if (values.description) formData.append('description', values.description);
    if (values.basis_document_number) formData.append('basis_document_number', values.basis_document_number);
    if (values.basis_document_file?.[0]) formData.append('basis_document_file', values.basis_document_file[0]);

    if (isUpdate) {
      updateStudent.mutate(formData as unknown as FormData); // Type assertion to satisfy TypeScript
    } else {
      createStudent.mutate(formData as unknown as FormData); // Type assertion to satisfy TypeScript
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={onSubmit}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="pinfl"
              label="PINFL"
              placeholder="PINFL kiriting"
              required
            />
            <FormInput
              control={form.control}
              name="first_name"
              label="Ism"
              placeholder="Ismni kiriting"
              required
            />
            <FormInput
              control={form.control}
              name="last_name"
              label="Familiya"
              placeholder="Familiyani kiriting"
              required
            />
            <FormInput
              control={form.control}
              name="middle_name"
              label="Otasining ismi"
              placeholder="Otasining ismini kiriting"
            />
            <FormSelect
              control={form.control}
              name="student_type"
              label="Talaba turi"
              placeholder="Talaba turini tanlang"
              required
              options={[
                { label: 'Grant (Scholarship)', value: 'SCHOLARSHIP' },
                { label: 'Kontrakt (Contract)', value: 'CONTRACT' },
              ]}
            />
            <FormInput
              control={form.control}
              name="course"
              label="Kurs"
              placeholder="Kursni kiriting"
              required
              type="number"
              min={1}
              max={4}
            />
            <FormInput
              control={form.control}
              name="until_date"
              label="Amal qilish sanasi"
              placeholder="YYYY-MM-DD"
              required
              type="date"
            />
            <FormSelect
              control={form.control}
              name="is_active"
              label="Holat"
              placeholder="Holatni tanlang"
              required
              options={[
                { label: 'Aktiv', value: 'true' },
                { label: 'Nofaol', value: 'false' },
              ]}
            />
          </div>
          <FormFileUpload
            control={form.control}
            name="image"
            label="Talaba rasmi"
            description="Talaba rasmini yuklang (maksimal 5MB)"
            required={!isUpdate}
            config={{
              maxSize: 5 * 1024 * 1024,
              maxFiles: 1,
accept: Object.fromEntries(ACCEPTED_IMAGE_TYPES.map(type => [type, []])),
            }}
          />
          <FormInput
            control={form.control}
            name="basis_document_number"
            label="Asos hujjat raqami"
            placeholder="Asos hujjat raqamini kiriting"
          />
          <FormFileUpload
            control={form.control}
            name="basis_document_file"
            label="Asos hujjat fayli"
            description="Asos hujjat faylini yuklang (maksimal 10MB)"
            config={{
              maxSize: 10 * 1024 * 1024,
              maxFiles: 1,
accept: Object.fromEntries(ACCEPTED_IMAGE_TYPES.map(type => [type, []])),
            }}
          />
          <FormTextarea
            control={form.control}
            name="description"
            label="Tavsif"
            placeholder="Talaba haqida qoshimcha malumot"
            config={{
              maxLength: 500,
              showCharCount: true,
              rows: 4,
            }}
          />
          <Button type="submit" disabled={createStudent.isPending || updateStudent.isPending}>
            {createStudent.isPending || updateStudent.isPending
              ? 'Yuklanmoqda...'
              : isUpdate
              ? 'Talaba Yangilash'
              : 'Talaba Qo\'shish'}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}