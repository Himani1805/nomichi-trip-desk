'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminEnquiryRedirect({ params }) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    router.replace(`/admin/leads/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center font-poppins text-sm font-light text-[#1C1B1A]">
      Opening lead workspace...
    </div>
  );
}
