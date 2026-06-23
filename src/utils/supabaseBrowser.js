import { createClient } from '@supabase/supabase-js';

let browserClient;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    },
  );

  return browserClient;
}
