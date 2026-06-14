import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, quantity, unit, category } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are a food listing copywriter for a food rescue platform called RePlate. Write a short (2-3 sentence), appetizing, and professional marketplace description for this food item:

Title: ${title}
Quantity: ${quantity} ${unit}
Category: ${category}

The description should:
- Sound warm, inviting, and appetizing
- Mention freshness or quality where appropriate
- Encourage someone to claim the food before it goes to waste
- Be concise and suitable for a food rescue marketplace listing
- Do NOT include the title, quantity, or category in the description - just the description text itself

Respond with ONLY the description text, no quotes, no labels, no extra formatting.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const description =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    if (!description) {
      return NextResponse.json(
        { error: 'No description was generated' },
        { status: 502 }
      );
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Generate description error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
