import { NavItem } from '@/types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Talabalar',
    url: '/dashboard/student',
    icon: 'user2',
    shortcut: ['s', 's'],
    isActive: false,
    items: []
  },
  {
    title: 'Ovqatlanish',
    url: '/dashboard/meals',
    icon: 'meals',
    shortcut: ['m', 'm'],
    isActive: false,
    items: [
      { title: "Ro'yxat", url: '/dashboard/meals' },
      { title: "Sana bo'yicha", url: '/dashboard/meals/by-date' },
      { title: 'Statistika', url: '/dashboard/meals/statistics' },
      { title: 'Yuz orqali', url: '/dashboard/meals/log-by-face' }
    ]
  },
  {
    title: 'Shikoyatlar',
    url: '/dashboard/complaints',
    icon: 'complaints',
    shortcut: ['c', 'c'],
    isActive: false,
    items: [
      { title: "Ro'yxat", url: '/dashboard/complaints' },
      { title: 'Statistika', url: '/dashboard/complaints/statistics' }
    ]
  },
  {
    title: 'Buyurtmalar',
    url: '/dashboard/orders/by-date',
    icon: 'orders',
    shortcut: ['o', 'o'],
    isActive: false,
    items: [
      { title: "Sana bo'yicha", url: '/dashboard/orders/by-date' },
      { title: 'Ovqatlanmaganlar', url: '/dashboard/orders/pending' },
      { title: 'Buyurtma berganlar', url: '/dashboard/orders/students-ordered' }
    ]
  },
  {
    title: 'Ovqatlanmaganlar',
    url: '/dashboard/no-eating',
    icon: 'employee',
    shortcut: ['n', 'n'],
    isActive: false,
    items: []
  }
];
