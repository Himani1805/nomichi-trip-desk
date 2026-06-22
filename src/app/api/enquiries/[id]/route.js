import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// GET handler to fetch details of a specific enquiry along with its call logs
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Fetch the detailed enquiry row with the associated trip details
    const { data: enquiry, error: enquiryError } = await supabase
      .from('enquiries')
      .select(`
        *,
        trips (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (enquiryError) {
      return NextResponse.json({ error: enquiryError.message }, { status: 404 });
    }

    // Fetch the timestamped notes linked to this specific record
    const { data: callLogs, error: logsError } = await supabase
      .from('call_logs')
      .select('*')
      .eq('enquiry_id', id)
      .order('created_at', { ascending: false });

    if (logsError) {
      return NextResponse.json({ error: logsError.message }, { status: 400 });
    }

    // Combine data structures into a single payload response
    return NextResponse.json({ enquiry, callLogs }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error fetching record' }, { status: 500 });
  }
}

// PATCH handler to update pipeline fields or append new interaction logs
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, assigned_owner, call_log_note } = body;

    let updatedEnquiry = null;
    let newLogEntry = null;

    // Build the fields object dynamically depending on what parameters were sent
    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (assigned_owner !== undefined) updateFields.assigned_owner = assigned_owner;

    // Execute the enquiries table updates if any modifications exist
    if (Object.keys(updateFields).length > 0) {
      const { data, error: updateError } = await supabase
        .from('enquiries')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }
      updatedEnquiry = data;
    }

    // Insert a new timeline point row if a note string is delivered in the stream
    if (call_log_note && call_log_note.trim() !== '') {
      const { data, error: logError } = await supabase
        .from('call_logs')
        .insert([
          {
            enquiry_id: id,
            note: call_log_note.trim()
          }
        ])
        .select()
        .single();

      if (logError) {
        return NextResponse.json({ error: logError.message }, { status: 400 });
      }
      newLogEntry = data;
    }

    return NextResponse.json(
      { 
        message: 'Record processed updates successfully', 
        enquiry: updatedEnquiry, 
        callLog: newLogEntry 
      }, 
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error committing changes' }, { status: 500 });
  }
}