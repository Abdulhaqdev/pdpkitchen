'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { IconDownload, IconLoader2 } from '@tabler/icons-react';

const BASE_URL = 'http://10.20.0.152:8000/api/';

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${BASE_URL}export/export-to-excel/`, {
        method: 'GET',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Export xatoligi');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meals_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Excel fayl muvaffaqiyatli yuklab olindi!');
    } catch (error) {
      toast.error(
        `Xatolik: ${error instanceof Error ? error.message : "Noma'lum xatolik"}`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting} variant='outline'>
      {isExporting ? (
        <>
          <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
          Yuklanmoqda...
        </>
      ) : (
        <>
          <IconDownload className='mr-2 h-4 w-4' />
          Excel ga eksport
        </>
      )}
    </Button>
  );
}
