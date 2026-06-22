// src/app/api/admin/trips/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. GET Handle: एडमिन पैनल के लिए सारी ट्रिप्स लोड करें (Fixes 405 Method Not Allowed)
export async function GET() {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data: trips });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST Handle: नई ट्रिप क्रिएट करें
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, location, price, description, is_open } = body;

    const { data: newTrip, error } = await supabase
      .from('trips')
      .insert([
        {
          title,
          location,
          price: parseFloat(price),
          description,
          is_open: is_open ?? true,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: newTrip });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PATCH Handle: ट्रिप अपडेट या ओपन/क्लोज टॉगल करें
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, is_open, title, location, price, description } = body;

    if (!id) return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });

    const updateData = {};
    if (typeof is_open === 'boolean') updateData.is_open = is_open;
    if (title) updateData.title = title;
    if (location) updateData.location = location;
    if (price) updateData.price = parseFloat(price);
    if (description) updateData.description = description;

    const { data: updatedTrip, error } = await supabase
      .from('trips')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}