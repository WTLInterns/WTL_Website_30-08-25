import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = "AIzaSyB73mYeWt79Q9zeLlbM79EHj6BwTiXkOXw";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

// Website-specific context: Replace/add more details as needed for best results
const WEBSITE_CONTEXT = `
You are WTL AI, a helpful assistant for World Trip Link (https://api.worldtriplink.com/), a cab booking platform for Maharashtra and India. Only answer questions related to:
- Cab booking, pricing, and vehicle types (Luxury, Hatchback, Sedan, etc.)
- Booking process, payment, and cancellation
- Service cities (Mumbai, Pune, Nashik, etc.)
- Contact info: +91 9730545491
- App features (Android/iOS), trip updates, and exclusive deals
- Do NOT answer questions unrelated to cab booking or this website.
If asked about anything else, politely say: "I'm here to help with cab bookings and information about World Trip Link only."
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages missing.' }, { status: 400 });
    }

    // Prepare the prompt for Gemini: system context + user conversation
    const prompt = [
      { role: 'system', content: WEBSITE_CONTEXT },
      ...messages.map((msg: any) => ({ role: msg.role, content: msg.content }))
    ];

    // Gemini expects a different format than OpenAI
    const geminiMessages = prompt.map((msg) => ({
      role: msg.role === 'system' ? 'user' : msg.role, // Gemini doesn't support 'system', so prepend as user
      parts: [{ text: msg.content }]
    }));

    // Call Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.3,
          topP: 1,
          maxOutputTokens: 512
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: 'Gemini API error: ' + error }, { status: 500 });
    }

    const data = await response.json();
    // Gemini's response structure
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ role: 'assistant', content: aiMessage });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error.' }, { status: 500 });
  }
}