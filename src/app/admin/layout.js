'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/utils/supabaseBrowser';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [checkingSession, setCheckingSession] = useState(!isLoginPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  useEffect(() => {
    if (isLoginPage) return;

    function setResponsiveSidebarState() {
      const width = window.innerWidth;
      setSidebarOpen(false);
      setSidebarCollapsed(width >= 768 && width < 1280);
    }

    setResponsiveSidebarState();
    window.addEventListener('resize', setResponsiveSidebarState);

    return () => window.removeEventListener('resize', setResponsiveSidebarState);
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', shortName: 'D' },
    { name: 'Leads', path: '/admin/leads', shortName: 'L' },
    { name: 'Trips', path: '/admin/trips', shortName: 'T' },
  ];

  const handleLogout = async () => {
    await getSupabaseBrowserClient().auth.signOut();
    router.push('/admin/login');
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBF5] font-poppins text-sm font-light text-[#1C1B1A]">
        Verifying session...
      </div>
    );
  }

  const sidebarWidth = sidebarCollapsed ? 'md:w-24' : 'md:w-64';

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-poppins text-[#1C1B1A] md:flex">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-[#1C1B1A]/35 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 max-w-[82vw] -translate-x-full flex-col border-r border-[#1C1B1A]/5 bg-white p-5 shadow-2xl transition-transform duration-300 md:sticky md:top-0 md:h-screen md:max-w-none md:translate-x-0 md:shadow-none ${sidebarOpen ? 'translate-x-0' : ''} ${sidebarWidth}`}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-8">
          <div className={`flex items-center gap-1 ${sidebarCollapsed ? 'md:justify-center' : 'justify-between'}`}>
            <Link
              href="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`inline-flex items-center gap-1 text-xl font-light tracking-[0.2em] ${sidebarCollapsed ? 'md:text-base md:tracking-[0.08em]' : ''}`}
            >
              <span>{sidebarCollapsed ? 'N' : 'NOMICHI'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#D55D27]" />
            </Link>
            <button
              type="button"
              aria-label="Close admin navigation"
              onClick={() => setSidebarOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C1B1A]/10 text-sm md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  title={item.name}
                  className={`flex min-h-11 items-center rounded-xl px-4 text-xs font-semibold uppercase tracking-wider transition-all ${
                    sidebarCollapsed ? 'md:justify-center md:px-0' : ''
                  } ${
                    isActive
                      ? 'bg-[#D55D27] text-[#FFFBF5]'
                      : 'text-[#1C1B1A]/60 hover:bg-[#FFFBF5] hover:text-[#D55D27]'
                  }`}
                >
                  <span className={sidebarCollapsed ? 'md:hidden' : ''}>{item.name}</span>
                  <span className={`hidden ${sidebarCollapsed ? 'md:inline' : ''}`}>{item.shortName}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-[#1C1B1A]/5 bg-[#FFFBF5]/95 px-4 py-3 backdrop-blur sm:px-6 md:px-8 lg:px-12">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open admin navigation"
                onClick={() => setSidebarOpen(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1C1B1A]/10 bg-white text-lg font-light md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label={sidebarCollapsed ? 'Expand admin navigation' : 'Collapse admin navigation'}
                onClick={() => setSidebarCollapsed((current) => !current)}
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1C1B1A]/10 bg-white text-lg font-light md:flex"
              >
                {sidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
              </button>
              <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1C1B1A]/45 sm:text-xs">
                Trip Desk
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="min-h-11 rounded-xl border border-[#D55D27]/20 bg-white px-4 text-[11px] font-semibold uppercase tracking-wider text-[#D55D27] shadow-sm transition-all hover:bg-[#D55D27] hover:text-[#FFFBF5] sm:px-5 sm:text-xs"
            >
              Sign Out
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-12 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
