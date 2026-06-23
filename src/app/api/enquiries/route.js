import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, group_type, preferred_month, note, trip_id } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields. Name and phone are mandatory.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          phone,
          email,
          group_type,
          preferred_month,
          note,
          trip_id: trip_id || null,
          status: 'NEW',
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error processing enquiry' }, { status: 500 });
  }
}
