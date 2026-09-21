import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    // 1. Validate the request body
    const body = await request.json().catch(() => null);
    if (!body || typeof body.text !== 'string' || body.text.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or empty "text" field in the request body.' },
        { status: 400 }
      );
    }

    const { text } = body;

    // 2. Validate API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is missing from environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // 3. Initialize Gemini API Client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 4. Define the exact JSON schema we want back
    const responseSchema: Schema = {
      type: Type.ARRAY,
      description: 'A list of structured tasks extracted from the user input.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { 
            type: Type.STRING, 
            description: 'A concise, actionable title for the task.' 
          },
          category: { 
            type: Type.STRING, 
            description: 'A short, single-word category for the task (e.g., Payment, Order, Marketing, Customer, General).' 
          },
          priority: { 
            type: Type.STRING,
            enum: ['HIGH', 'MEDIUM', 'NORMAL'],
            description: 'The priority level of the task.' 
          },
          deadline: { 
            type: Type.STRING, 
            description: 'A short string representing the deadline (e.g., "Today", "Tomorrow", "Next Friday", "No deadline").' 
          },
          completed: { 
            type: Type.BOOLEAN, 
            description: 'Always false for new tasks.' 
          },
        },
        required: ['title', 'category', 'priority', 'deadline', 'completed'],
      },
    };

    const prompt = `You are an AI task organizer. Analyze the following messy business instructions and extract actionable tasks. 
For each task, assign a title, a relevant single-word category, a priority level (HIGH, MEDIUM, or NORMAL), a relative deadline, and set completed to false.

Input:
"${text}"`;

    // 5. Call the Gemini API with retry logic for 503 errors
    let responseText = '';
    let attempts = 0;
    const maxAttempts = 3;
    const delays = [2000, 4000];

    while (attempts < maxAttempts) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.2, // Low temperature for more deterministic output
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

    // 6. Parse and validate the JSON
    let tasks;
    try {
      tasks = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini output:', parseError);
      return NextResponse.json(
        { error: 'AI output was malformed.' },
        { status: 502 }
      );
    }

    if (!Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'AI did not return a list of tasks.' },
        { status: 502 }
      );
    }

    // Assign a unique ID to each task before sending to the frontend
    const tasksWithIds = tasks.map((task: { title: string, category: string, priority: string, deadline: string, completed: boolean }) => ({
      ...task,
      id: crypto.randomUUID(),
    }));

    // 7. Return the structured response
    return NextResponse.json({ tasks: tasksWithIds }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/organize route:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
