import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export async function GET(request, { params }) {
  const { id } = params;

  const { data: lead, error } = await supabase
    .from('enquiries') 
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: lead });
}

export async function PATCH(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { status, owner } = body;

    const updateData = {};
    if (status) updateData.status = status;
    if (owner) updateData.owner = owner;

    const { data: updatedLead, error } = await supabase
      .from('enquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}