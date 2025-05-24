export type Transaction = {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  category: string | null
  note: string | null
  created_at: string // ISO string from Supabase
}
