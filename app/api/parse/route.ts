// app/api/parse/route.ts

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You extract financial transaction data from natural language and return JSON with type, amount, category, and optional note.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    })

    const text = completion.choices[0].message.content || '{}'
    const data = JSON.parse(text)
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PARSE_ERROR]', err)
    return NextResponse.json({ error: 'Failed to parse input' }, { status: 500 })
  }
}
