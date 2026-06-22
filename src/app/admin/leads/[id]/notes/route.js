// src/app/api/admin/leads/[id]/notes/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. किसी विशिष्ट लीड के सारे नोट्स निकालें
export async function GET(request, { params }) {
  const { id } = params;

  const { data: notes, error } = await supabase
    .from('lead_notes') // सुनिश्चित करें कि आपके Supabase में यह टेबल या 'notes' टेबल हो
    .select('*')
    .eq('lead_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: notes });
}

// 2. नया नोट सेव करें
export async function POST(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Note content cannot be empty' }, { status: 400 });
    }

    const { data: newNote, error } = await supabase
      .from('lead_notes')
      .insert([
        {
          lead_id: id,
          content: content.trim(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: newNote });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}