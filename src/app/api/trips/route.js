import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('status', 'open')
      .not('name', 'ilike', 'QA%')
      .not('name', 'ilike', '%audit%')
      .not('destination', 'ilike', 'QA%')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
