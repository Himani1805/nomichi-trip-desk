import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { normalizePipelineStage, requireAdminUser } from '@/utils/adminAuth';

const PIPELINE_STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE CHECK',
  'SENT',
  'CONFIRMED',
  'NOT A FIT',
];

export async function GET(request) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    await supabase
      .from('enquiries')
      .update({ status: 'VIBE CHECK' })
      .eq('status', 'VIBE CHECK SENT');

    const { data: enquiries, error: enquiriesError } = await supabase
      .from('enquiries')
      .select('status, trip_id');

    if (enquiriesError) {
      return NextResponse.json({ success: false, error: enquiriesError.message }, { status: 400 });
    }

    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('id, name');

    if (tripsError) {
      return NextResponse.json({ success: false, error: tripsError.message }, { status: 400 });
    }

    const leadsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage] = 0;
      return acc;
    }, {});

    for (const enquiry of enquiries || []) {
      const stage = normalizePipelineStage(enquiry.status);
      leadsByStage[stage] = (leadsByStage[stage] || 0) + 1;
    }

    const leadsPerTrip = (trips || []).map((trip) => ({
      tripName: trip.name || 'Untitled trip',
      count: (enquiries || []).filter((enquiry) => enquiry.trip_id === trip.id).length,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalLeads: enquiries?.length || 0,
        leadsByStage,
        leadsPerTrip,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
