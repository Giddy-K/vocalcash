export type Transaction = {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  category?: string
  note?: string
  created_at: string
}
