// Updated SignInViewPage component - login uchun alohida mutation ishlatish mumkin, lekin reusable emas, shuning uchun loginni alohida saqlaymiz
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';

const BASE_URL = 'https://pdpkitchen.diyarbek.uz/api/';

export default function SignInViewPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch(`${BASE_URL}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Kirishda xatolik yuz berdi');
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      document.cookie = `access_token=${data.access}; path=/`;
      document.cookie = `refresh_token=${data.refresh}; path=/`;
      router.push('/dashboard'); // Yoki kerakli sahifaga o'tkazish
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Noma'lum xatolik");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate({ username, password });
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='bg-muted relative flex h-full items-center justify-center lg:flex dark:border-r'>
        <Image
          width={300}
          height={300}
          src='/pdp.jpg'
          alt='Login background'
          className='relative z-10 h-80 w-80 rounded-full object-cover shadow-xl'
        />
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <div className='w-full space-y-4'>
            <h2 className='text-2xl font-bold'>Kirish</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='username' className='text-sm font-medium'>
                  Foydalanuvchi nomi
                </label>
                <input
                  id='username'
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Foydalanuvchi nomingizni kiriting'
                  required
                  disabled={mutation.isPending}
                />
              </div>
              <div className='space-y-2'>
                <label htmlFor='password' className='text-sm font-medium'>
                  Parol
                </label>
                <input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                  placeholder='Parolingizni kiriting'
                  required
                  disabled={mutation.isPending}
                />
              </div>
              {error && <p className='text-destructive text-sm'>{error}</p>}
              <button
                type='submit'
                disabled={mutation.isPending}
                className='bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring w-full rounded-md px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              >
                {mutation.isPending ? 'Kutmoqda...' : 'Kirish'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
