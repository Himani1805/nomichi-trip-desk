'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center font-poppins text-sm font-light text-[#1C1B1A]">
      Opening dashboard...
    </div>
  );
}
