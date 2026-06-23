import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const ALLOWED_PIPELINE_STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE CHECK',
  'SENT',
  'CONFIRMED',
  'NOT A FIT',
];

export function normalizePipelineStage(value) {
  const normalized = String(value || 'NEW').trim().toUpperCase();

  if (normalized === 'VIBE CHECK SENT') {
    return 'VIBE CHECK';
  }

  if (ALLOWED_PIPELINE_STAGES.includes(normalized)) {
    return normalized;
  }

  return 'NEW';
}

export function isAllowedPipelineStage(value) {
  return ALLOWED_PIPELINE_STAGES.includes(String(value || '').trim().toUpperCase());
}

export function unauthorizedResponse() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
}

function getAllowedAdminEmails() {
  const configuredEmails = process.env.ADMIN_EMAIL_ALLOWLIST || process.env.NEXT_PUBLIC_ADMIN_EMAIL_ALLOWLIST || 'admin@nomichi.com';

  return configuredEmails
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminUser(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return { user: null, response: unauthorizedResponse() };
  }

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data.user) {
    return { user: null, response: unauthorizedResponse() };
  }

  const userEmail = data.user.email?.toLowerCase();
  const allowedEmails = getAllowedAdminEmails();

  if (!userEmail || !allowedEmails.includes(userEmail)) {
    return { user: data.user, response: forbiddenResponse() };
  }

  return { user: data.user, response: null };
}
