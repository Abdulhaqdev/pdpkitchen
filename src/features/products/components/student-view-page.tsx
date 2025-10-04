'use client';

import { useApiQuery } from '@/lib/api';
import { Studentpost } from '@/constants/data';
import StudentForm from './student-form';
import { useRouter } from 'next/navigation';

type StudentViewPageProps = {
  studentId: string;
};

export default function StudentViewPage({ studentId }: StudentViewPageProps) {
  const router = useRouter();
  const { data: student, isLoading, error } = useApiQuery<Studentpost>(
    `students/${studentId}/`
  );

  if (studentId === 'new') {
    return <StudentForm initialData={null} pageTitle="Create New Student" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !student) {
    router.push('/404'); // Or handle error differently
    return null;
  }

  const pageTitle = `Edit Student: ${student.first_name} ${student.last_name}`;
  return <StudentForm initialData={student} pageTitle={pageTitle} />;
}