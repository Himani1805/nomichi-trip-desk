import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// POST handler for public lead capture
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, group_type, preferred_month, note, trip_id } = body;

    // Server side validation for required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields. Name and phone are mandatory.' },
        { status: 400 }
      );
    }

    // Insert data into the enquiries table
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
          status: 'NEW' // Default explicitly stated
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

// GET handler for admin mini CRM listing with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const trip_id = searchParams.get('trip_id');
    const search = searchParams.get('search');

    // Build query joining the trips table to get trip details
    let query = supabase
      .from('enquiries')
      .select(`
        *,
        trips (
          name
        )
      `);

    // Apply exact status filter if present
    if (status) {
      query = query.eq('status', status);
    }

    // Apply exact trip relation filter if present
    if (trip_id) {
      query = query.eq('trip_id', trip_id);
    }

    // Apply text search across name and email via ILIKE if present
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Order results chronologically so new items hit the top
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error retrieving entries' }, { status: 500 });
  }
}
