import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { normalizePipelineStage, requireAdminUser } from '@/utils/adminAuth';

export async function GET(request) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const tripId = searchParams.get('trip_id');
    const owner = searchParams.get('owner');

    let query = supabase
      .from('enquiries')
      .select(`
        *,
        trips (
          name,
          destination
        )
      `)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    if (status) {
      const normalizedStatus = normalizePipelineStage(status);
      if (normalizedStatus === 'VIBE CHECK') {
        query = query.in('status', ['VIBE CHECK', 'VIBE CHECK SENT']);
      } else {
        query = query.eq('status', normalizedStatus);
      }
    }

    if (tripId) {
      query = query.eq('trip_id', tripId);
    }

    if (owner) {
      query = query.eq('assigned_owner', owner);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const normalizedData = (data || []).map((lead) => ({
      ...lead,
      status: normalizePipelineStage(lead.status),
    }));

    return NextResponse.json({ success: true, data: normalizedData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
