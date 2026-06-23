import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { requireAdminUser } from '@/utils/adminAuth';

export async function POST(request) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.response) return auth.response;

    const body = await request.json();
    const { enquiryId } = body;

    if (!enquiryId) {
      return NextResponse.json({ error: 'Missing enquiry id parameter' }, { status: 400 });
    }

    const { data: enquiry, error: dbError } = await supabase
      .from('enquiries')
      .select(`
        *,
        trips (
          name,
          destination,
          location,
          description
        )
      `)
      .eq('id', enquiryId)
      .single();

    if (dbError || !enquiry) {
      return NextResponse.json({ error: 'Enquiry record not found' }, { status: 404 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key configuration missing' }, { status: 500 });
    }

    const prompt = `You are an internal tool helper for Nomichi, a slow travel brand.
Analyze this traveller enquiry and return a raw JSON object.

Traveller Name: ${enquiry.name}
Trip Selected: ${enquiry.trips?.name || 'General interest'} to ${enquiry.trips?.destination || enquiry.trips?.location || 'Explore'}
Trip Info: ${enquiry.trips?.description || ''}
Traveller Preferred Pace / Hope for the trip: "${enquiry.note || 'Not specified'}"

Strict Tone Constraints:
- Do not use exclamation marks anywhere.
- Do not use em-dashes.
- Write in short, calm, grounded sentences.
- Do not use corporate AI-isms like "unlock", "elevate", or "embark on a journey".
- Use the second person to address the traveller in the draft.

Return a valid JSON object matching this schema exactly:
{
  "whatsappDraft": "A short, warm message greeting them and acknowledging what they hope this trip feels like, keeping it specific and still.",
  "vibeCheck": "A one-line assessment of whether they fit slow, small-group travel based on their note, citing a concrete detail."
}

Return only the raw JSON. Do not wrap it in markdown code blocks.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Gemini remote execution failure', details: errorData }, { status: 502 });
    }

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({ error: 'Empty payload generated from model response' }, { status: 500 });
    }

    const parsedData = JSON.parse(rawText.trim());

    return NextResponse.json({ data: parsedData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal system interface failure processing request' }, { status: 500 });
  }
}
