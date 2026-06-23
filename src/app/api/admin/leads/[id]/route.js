import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import {
  isAllowedPipelineStage,
  normalizePipelineStage,
  requireAdminUser,
} from '@/utils/adminAuth';

export async function GET(request, { params }) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const { id } = await params;
    const { data, error } = await supabase
      .from('enquiries')
      .select(`
        *,
        trips (
          name,
          destination,
          description
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        status: normalizePipelineStage(data.status),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const { id } = await params;
    const body = await request.json();
    const updateData = {};

    if (body.status !== undefined) {
      if (!isAllowedPipelineStage(body.status)) {
        return NextResponse.json({ success: false, error: 'Invalid pipeline stage' }, { status: 400 });
      }
      updateData.status = normalizePipelineStage(body.status);
    }
    if (body.owner !== undefined) updateData.assigned_owner = body.owner;
    if (body.assigned_owner !== undefined) updateData.assigned_owner = body.assigned_owner;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields provided' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('enquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        status: normalizePipelineStage(data.status),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
