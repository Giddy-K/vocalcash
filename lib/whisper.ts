// lib/whisper.ts

export type ParsedTransaction = {
  type: 'income' | 'expense'
  amount: number
  category: string
  note?: string
}

// 👇 You can use Claude, GPT-4 or another LLM
export async function parseTransactionFromText(transcript: string): Promise<ParsedTransaction> {
  // Example Claude-compatible prompt (you'll route this through your API call)
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
  })

  const json = await response.json()
  return json as ParsedTransaction
}
