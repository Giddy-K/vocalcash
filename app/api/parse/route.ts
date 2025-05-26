// app/api/parse/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'llama3-70b-8192',
      response_format: { type: 'json_object' },  // asking for pure JSON
      messages: [
        {
          role: 'system',
          content:
            'You are a parser. Return ONLY valid JSON with keys: type, amount, category, note.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
    })

    const raw = completion.choices[0].message.content?.trim() || '{}'

    // Fallback in case the model still adds text
    const jsonStr = raw.startsWith('{')
      ? raw
      : raw.match(/\{[\s\S]*?\}/)?.[0] ?? '{}'

    const data = JSON.parse(jsonStr)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PARSE_ERROR]', err)
    return NextResponse.json(
      { error: 'Failed to parse input' },
      { status: 500 }
    )
  }
}
