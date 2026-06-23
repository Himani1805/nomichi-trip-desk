import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { requireAdminUser } from '@/utils/adminAuth';

export async function GET(request, { params }) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const { id } = await params;
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('enquiry_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const notes = (data || []).map((log) => ({
      id: log.id,
      content: log.note,
      created_at: log.created_at,
    }));

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const { id } = await params;
    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json({ success: false, error: 'Note content is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('call_logs')
      .insert([{ enquiry_id: id, note: content.trim() }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        content: data.note,
        created_at: data.created_at,
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
