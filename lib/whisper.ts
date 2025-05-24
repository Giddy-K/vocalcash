// lib/whisper.ts
export type ParsedTransaction = {
  type: 'income' | 'expense'
  amount: number
  category: string
  note?: string
}

export async function parseTransactionFromText(
  transcript: string
): Promise<ParsedTransaction> {
  const prompt = `
You are an assistant that extracts structured financial data from natural language.

Given this user input:
"${transcript}"

Extract and return a JSON object with:
- type: "income" or "expense"
- amount: a number
- category: short label (e.g., "groceries", "salary", "rent")
- note: optional additional text

Only return valid JSON.
`

  const response = await fetch('/api/parse', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
    headers: { 'Content-Type': 'application/json' },
  })

  const json = await response.json()
  console.log('🔍 Parsed response:', json)

  if (!json || !json.type || !json.amount || !json.category) {
    throw new Error('Invalid response format from LLM')
  }

  // ✅ Return ensures every code path returns a ParsedTransaction
  return json as ParsedTransaction
}
