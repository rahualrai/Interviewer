import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file');
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API Key.' }, { status: 500 });
    }

    // Prepare the form data for the transcription request.
    const transcriptionFormData = new FormData();
    transcriptionFormData.append('file', audioFile);
    transcriptionFormData.append('model', 'whisper-1');

    // Call OpenAI's audio transcription endpoint.
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: transcriptionFormData
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: 'Transcription failed', details: errorData },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error processing transcription', details: error.message },
      { status: 500 }
    );
  }
}