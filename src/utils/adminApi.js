import { getSupabaseBrowserClient } from './supabaseBrowser';

export async function adminFetch(input, init = {}) {
  const supabase = getSupabaseBrowserClient();
  let { data } = await supabase.auth.getSession();
  let token = data.session?.access_token;

  if (!token) {
    const refreshed = await supabase.auth.refreshSession();
    token = refreshed.data.session?.access_token;
  }

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await supabase.auth.refreshSession();
  const refreshedToken = refreshed.data.session?.access_token;

  if (!refreshedToken || refreshedToken === token) {
    return response;
  }

  headers.set('Authorization', `Bearer ${refreshedToken}`);

  return fetch(input, {
    ...init,
    headers,
  });
}
