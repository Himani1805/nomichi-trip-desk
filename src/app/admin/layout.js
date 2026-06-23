'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/utils/supabaseBrowser';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [checkingSession, setCheckingSession] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    let active = true;
    const supabase = getSupabaseBrowserClient();

    async function verifySession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (!data.session) {
        router.replace('/admin/login');
        return;
      }

      setCheckingSession(false);
    }

    verifySession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        router.replace('/admin/login');
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Leads', path: '/admin/leads' },
    { name: 'Trips', path: '/admin/trips' }
  ];

  const handleLogout = async () => {
    await getSupabaseBrowserClient().auth.signOut();
    router.push('/admin/login');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center font-poppins text-sm font-light text-[#1C1B1A]">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#1C1B1A] font-poppins flex">
      <aside className="w-64 border-r border-[#1C1B1A]/5 bg-white flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-1 text-xl font-light tracking-[0.2em]">
            <span>NOMICHI</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#D55D27]" />
          </div>
          
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-xs font-semibold uppercase tracking-wider px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#D55D27] text-white'
                      : 'text-[#1C1B1A]/60 hover:bg-[#FFFBF5] hover:text-[#1C1B1A]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-left text-xs font-semibold uppercase tracking-wider text-red-600 border border-red-100 px-4 py-3 rounded-xl hover:bg-red-50 transition-all"
        >
          Sign Out
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 border-b border-[#1C1B1A]/5 bg-[#FFFBF5]/95 px-8 py-4 backdrop-blur md:px-12">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1C1B1A]/45">
              Admin Workspace
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-100 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-600 shadow-sm transition-all hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
