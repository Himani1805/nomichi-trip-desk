import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { requireAdminUser } from '@/utils/adminAuth';

export async function GET(request) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const body = await request.json();
    const name = body.name || body.title;
    const destination = body.destination || body.location;
    const price = body.price;

    if (!name || !destination || price === undefined || price === '') {
      return NextResponse.json(
        { success: false, error: 'Name, destination, and price are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('trips')
      .insert([{
        name,
        destination,
        price: Number(price),
        description: body.description || '',
        status: body.status || 'open',
        total_seats: Number(body.total_seats || 10),
        start_date: body.start_date || null,
        end_date: body.end_date || null,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Trip id is required' }, { status: 400 });
    }

    const updateData = {};
    if (body.name || body.title) updateData.name = body.name || body.title;
    if (body.destination || body.location) updateData.destination = body.destination || body.location;
    if (body.price !== undefined && body.price !== '') updateData.price = Number(body.price);
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (typeof body.is_open === 'boolean') updateData.status = body.is_open ? 'open' : 'closed';
    if (body.start_date !== undefined) updateData.start_date = body.start_date || null;
    if (body.end_date !== undefined) updateData.end_date = body.end_date || null;
    if (body.total_seats !== undefined) updateData.total_seats = Number(body.total_seats);

    const { data, error } = await supabase
      .from('trips')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
