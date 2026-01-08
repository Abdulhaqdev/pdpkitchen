'use client';

import { use } from 'react';
import ComplaintDetailPage from '@/features/complaints/components/complaint-detail-page';

type PageProps = {
  params: Promise<{ complaintId: string }>;
};

export default function ComplaintDetail({ params }: PageProps) {
  const { complaintId } = use(params);
  return <ComplaintDetailPage complaintId={complaintId} />;
}
