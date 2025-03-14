import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Missing "message" in request body.' }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({ error: 'Missing OpenAI API key.' }, { status: 500 });
    }

    // Use the correct TTS endpoint per OpenAI's docs.
    const endpoint = 'https://api.openai.com/v1/audio/speech';
    const payload = {
      input: message,
      voice: 'sage', // Use the Sage voice model
      model: 'tts-1' // or use 'tts-1-hd' for higher quality
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText }, { status: res.status });
    }

    // Read the response as binary data (not JSON)
    const audioArrayBuffer = await res.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg'); // Adjust if you use another audio format

    return new NextResponse(audioBuffer, { headers });
  } catch (error) {
    console.error("Error in voiceResponse API:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}