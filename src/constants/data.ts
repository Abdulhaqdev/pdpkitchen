import { NavItem } from '@/types';


//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Students',
    url: '/dashboard/student',
    icon: 'user2',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
];




// constants/data.ts - Add Student type
export interface Student {
  id: number;
  pinfl: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  student_type: string;
  course: number;
  enrollment_date: string;
  until_date: string;
  is_active: boolean;
  image: string;
  description: string,
  basis_document_number: string | null,
  basis_document_file: string | null
}

// @/types/student.ts (updated)
export interface Studentpost {
  id: number;
  pinfl: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  student_type: 'SCHOLARSHIP' | 'CONTRACT';
  course: number;
  enrollment_date: string;
  until_date: string;
  is_active: boolean;
  image?: string;
  description?: string;
  base_document_file?: string;
  basis_document_number?: string;
}