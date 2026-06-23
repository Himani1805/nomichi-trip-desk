import { getSupabaseBrowserClient } from './supabaseBrowser';

export async function adminFetch(input, init = {}) {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
