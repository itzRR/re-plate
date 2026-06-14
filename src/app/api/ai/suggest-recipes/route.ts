import { NextResponse } from 'next/server';

interface RecipeSuggestion {
  title: string;
  description: string;
  emoji: string;
}

export async function POST(request: Request) {
  try {
    const { title, description, category, dietary_tags } = await request.json();

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

    const dietaryInfo =
      dietary_tags && dietary_tags.length > 0
        ? `Dietary restrictions to consider: ${dietary_tags.join(', ')}`
        : 'No specific dietary restrictions';

    const prompt = `You are a creative chef assistant for a food rescue platform. Given the following rescued food item, suggest 3 creative, practical ways to use, prepare, or reheat it.

Food Item: ${title}
Description: ${description || 'No description provided'}
Category: ${category || 'General'}
${dietaryInfo}

For each suggestion, provide:
1. A relevant single emoji
2. A short creative title (max 6 words)
3. A practical 1-2 sentence description with tips

IMPORTANT: Respect dietary restrictions strictly. If the food is vegan, all suggestions must be vegan-friendly. Same for halal, kosher, gluten-free, etc.

Respond in this exact JSON format and nothing else:
[
  { "emoji": "🍳", "title": "Quick Morning Hash", "description": "Dice and pan-fry with olive oil, garlic, and your favorite seasonings for a quick and hearty breakfast hash." },
  { "emoji": "🥗", "title": "Fresh Garden Salad", "description": "Chop into bite-sized pieces and toss with mixed greens, a squeeze of lemon, and a drizzle of olive oil." },
  { "emoji": "🍲", "title": "Hearty Comfort Soup", "description": "Simmer with vegetable broth, diced onions, and herbs for a warming soup that stretches the ingredients further." }
]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      
      let errorMessage = 'Failed to generate recipe suggestions';
      try {
        const parsed = JSON.parse(errorData);
        errorMessage = parsed?.error?.message || errorMessage;
      } catch {}
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    if (!rawText) {
      return NextResponse.json(
        { error: 'No suggestions were generated' },
        { status: 502 }
      );
    }

    // Extract JSON array from the response (handle markdown code fences)
    let jsonStr = rawText;
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    let suggestions: RecipeSuggestion[];
    try {
      suggestions = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse Gemini response:', rawText);
      // Fallback suggestions
      suggestions = [
        {
          emoji: '🍽️',
          title: 'Enjoy As-Is',
          description: `This ${title.toLowerCase()} is ready to enjoy! Simply warm it up if needed and serve.`,
        },
        {
          emoji: '🔄',
          title: 'Creative Remix',
          description: `Transform this into something new by combining with fresh ingredients you have on hand.`,
        },
        {
          emoji: '❄️',
          title: 'Freeze for Later',
          description: `Portion and freeze to extend shelf life. Thaw overnight in the fridge when ready to enjoy.`,
        },
      ];
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggest recipes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
