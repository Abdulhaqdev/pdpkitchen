// Student Types based on OpenAPI spec

export type StudentTypeEnum = 'SCHOLARSHIP' | 'CONTRACT';

export interface Student {
  id: number;
  pinfl: string;
  hemis_id: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  student_type: StudentTypeEnum;
  course: number;
  enrollment_date: string;
  until_date: string;
  is_active: boolean;
  image: string | null;
  description: string | null;
  basis_document_number: string | null;
  basis_document_file: string | null;
}

export interface StudentList {
  id: number;
  pinfl: string;
  hemis_id: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  student_type: StudentTypeEnum;
  course: number;
  enrollment_date: string;
  until_date: string;
  is_active: boolean;
  image: string | null;
  description: string | null;
  basis_document_number: string | null;
  basis_document_file: string | null;
}

export interface StudentBasic {
  id: number;
  pinfl: string;
  first_name: string;
  last_name: string;
  course: number;
  student_type: string;
}

export interface StudentDetail {
  id: number;
  pinfl: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  full_name: string;
  student_type: StudentTypeEnum;
  course: number;
  enrollment_date: string;
  until_date: string;
  is_active: boolean;
  image_url: string;
  description: string | null;
}

export interface StudentDetailInOrder {
  id: number;
  pinfl: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  course: number;
  student_type: string;
}

export interface StudentDetailedInfo {
  id: number;
  pinfl: string;
  name: string;
  course: number;
  student_type: StudentTypeEnum;
  is_active: boolean;
  enrollment_date: string;
  until_date: string;
}

export interface StudentRequest {
  pinfl: string;
  hemis_id?: string | null;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  student_type?: StudentTypeEnum;
  course: number;
  until_date: string;
  is_active?: boolean;
  image?: File | null;
  description?: string | null;
  basis_document_number?: string | null;
  basis_document_file?: File | null;
}

export interface StudentDataCollection {
  pinfl: string;
  image: string;
}

export interface StudentDataCollectionRequest {
  pinfl: string;
  image: File;
}

export interface UpdateImageViaHemisId {
  hemis_id: string;
  image: string;
}

export interface UpdateImageViaHemisIdRequest {
  hemis_id: string;
  image: File;
}

export interface InactiveStudent {
  id: number;
  pinfl: string;
  name: string;
  course: number;
  student_type: StudentTypeEnum;
  enrollment_date: string;
  until_date: string;
  days_since_last_meal: number | null;
  last_meal_date: string | null;
  total_meals: number;
}
