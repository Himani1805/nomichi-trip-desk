import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// GET handler to fetch trips based on status filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // Start building the supabase query
    let query = supabase.from('trips').select('*');

    // If status is specific, filter by it. Otherwise, return all records.
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    } else {
      // Admin default sorting order
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST handler to create a new trip record from admin portal
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      destination, 
      start_date, 
      end_date, 
      price, 
      total_seats, 
      status, 
      description 
    } = body;

    // Simple backend field presence validation check
    if (!name || !destination || price === undefined || total_seats === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters. Name, destination, price, and total seats must be provided.' }, 
        { status: 400 }
      );
    }

    // Insert structured object record into supabase table instance
    const { data, error } = await supabase
      .from('trips')
      .insert([
        {
          name,
          destination,
          start_date,
          end_date,
          price: Number(price),
          total_seats: Number(total_seats),
          status: status || 'open',
          description: description || ''
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error failed to process entry' }, { status: 500 });
  }
}