import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    // Fetch all enquiries with status and trip_id fields
    const { data: enquiries, error: enquiriesError } = await supabase
      .from('enquiries')
      .select('status, trip_id');

    if (enquiriesError) {
      return NextResponse.json({ error: enquiriesError.message }, { status: 400 });
    }

    // Fetch all trips to map names correctly to metrics
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('id, name');

    if (tripsError) {
      return NextResponse.json({ error: tripsError.message }, { status: 400 });
    }

    // 1. Calculate absolute total leads count
    const totalLeads = enquiries.length;

    // 2. Count leads per pipeline stage using an object reduce accumulator
    const leadsByStage = enquiries.reduce((acc, enquiry) => {
      const stage = enquiry.status || 'NEW';
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});

    // Initialize all possible tracking pipeline states to zero if empty
    const pipelineStages = ['NEW', 'CONTACTED', 'QUALIFIED', 'VIBE CHECK', 'SENT', 'CONFIRMED', 'NOT A FIT'];
    pipelineStages.forEach(stage => {
      if (leadsByStage[stage] === undefined) {
        leadsByStage[stage] = 0;
      }
    });

    // 3. Count enquiries for each individual trip record using map and filter
    const leadsPerTrip = trips.map(trip => {
      const matchingLeadsCount = enquiries.filter(enquiry => enquiry.trip_id === trip.id).length;
      return {
        tripName: trip.name,
        count: matchingLeadsCount
      };
    });

    // Return the calculated dashboard data structure payload
    return NextResponse.json(
      {
        totalLeads,
        leadsByStage,
        leadsPerTrip
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error aggregating metrics data' }, { status: 500 });
  }
}