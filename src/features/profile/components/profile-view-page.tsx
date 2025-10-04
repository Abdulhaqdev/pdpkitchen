'use client';

import { Student } from '@/constants/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApiQuery } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';

type TProfileViewPageProps = {
  studentId: string;
};

export default function ProfileViewPage({ studentId }: TProfileViewPageProps) {
  const endpoint = `students/${studentId}/`;
  const { data: student, isPending, error } = useApiQuery<Student>(endpoint);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center font-semibold">
        Yuklanmoqda...
      </div>
    );
  }

  if (error || !student) {
    notFound();
  }

  return (
    <div className=" w-full flex items-center justify-center ">
      <Card className="w-full h-full shadow-md border">
        <CardHeader className="border-b p-6">
          <CardTitle className="text-left text-2xl font-bold">
            {student.first_name} {student.last_name} {student.middle_name || ''} - Detail
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 flex flex-col md:flex-row gap-6 overflow-auto">
          {/* Student image */}
         <div className="flex-shrink-0">
  <Image
    src={student.image}
    alt="Student image"
    width={320} // Adjust based on your design (e.g., 320px)
    height={320} // Adjust based on your design (e.g., 320px)
    className="h-80 w-80 rounded-lg object-cover border shadow-sm"
  />
</div>

          {/* Student details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
            <div>
              <p className="font-semibold">ID:</p>
              <p>{student.id}</p>
            </div>
            <div>
              <p className="font-semibold">PINFL:</p>
              <p>{student.pinfl}</p>
            </div>
            <div>
              <p className="font-semibold">Talaba turi:</p>
              <Badge variant="outline">{student.student_type}</Badge>
            </div>
            <div>
              <p className="font-semibold">Kurs:</p>
              <p>{student.course}</p>
            </div>
            <div>
              <p className="font-semibold">{"Ro'yxatga olingan sana:"}</p>
              <p>{student.enrollment_date}</p>
            </div>
            <div>
              <p className="font-semibold">Muddat tugash sanasi:</p>
              <p>{student.until_date}</p>
            </div>
            <div>
              <p className="font-semibold">Faol:</p>
              <Badge variant={student.is_active ? 'default' : 'secondary'}>
                {student.is_active ? 'Ha' : "Yo'q"}
              </Badge>
            </div>
            <div className="col-span-2">
              <p className="font-semibold">Tavsif:</p>
              <p>{student.description || 'Tavsif mavjud emas'}</p>
            </div>
            <div>
              <p className="font-semibold">Asos hujjat raqami:</p>
              <p>{student.basis_document_number || 'Raqam mavjud emas'}</p>
            </div>
            <div>
              <p className="font-semibold">Asos hujjat fayli:</p>
              {student.basis_document_file ? (
                <a
                  href={student.basis_document_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-80"
                >
                  Faylni yuklab olish
                </a>
              ) : (
                <p>Fayl mavjud emas</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
