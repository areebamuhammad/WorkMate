import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body || typeof body.customerMessage !== 'string' || body.customerMessage.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or empty "customerMessage" field.' },
        { status: 400 }
      );
    }

    const { customerMessage, tone = 'Friendly' } = body;

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing from environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are an AI customer service assistant for a small-business owner. 
Generate a concise, professional reply to the following customer message.
Ensure the tone of the response is exactly: ${tone}.

Customer Message:
"${customerMessage}"

Do not include any placeholders like [Your Name] unless absolutely necessary. Keep the reply short and ready to send.`;

    let responseText = '';
    let attempts = 0;
    const maxAttempts = 3;
    const delays = [2000, 4000]; // 2s before 1st retry, 4s before 2nd retry

    while (attempts < maxAttempts) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.7, // slightly higher temperature for varied tones
          },
        });
        
        responseText = response.text || '';
        break; // Success, exit loop
      } catch (err: unknown) {
        attempts++;
        const errorObj = err as Record<string, unknown>;
        const is503 = errorObj?.status === 503 || (typeof errorObj?.message === 'string' && errorObj.message.includes('503'));
        
        if (is503 && attempts < maxAttempts) {
          console.warn(`Gemini API 503 error. Retrying attempt ${attempts + 1} after ${delays[attempts - 1]}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delays[attempts - 1]));
        } else {
          // If it's not a 503 error or we've run out of attempts, rethrow
          throw err;
        }
      }
    }

    if (!responseText) {
      throw new Error('Gemini API returned an empty response.');
    }

    return NextResponse.json({ reply: responseText.trim() }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/reply route:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
