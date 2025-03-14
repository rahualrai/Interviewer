import { NextRequest, NextResponse } from 'next/server';

let currentAudio: HTMLAudioElement | null = null;

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

export const playVoiceResponse = async (text: string): Promise<void> => {
  try {
    const response = await fetch('/api/voiceResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    if (!response.ok) throw new Error('Voice response API failed');
    const audioData = await response.arrayBuffer();
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(audioBlob);
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      URL.revokeObjectURL(currentAudio.src);
      currentAudio = null;
    }
    currentAudio = new Audio(url);
    return new Promise<void>((resolve) => {
      currentAudio!.onended = () => {
         resolve();
      };
      currentAudio!.play();
    });
  } catch (error) {
    console.error('Error playing voice response:', error);
  }
};