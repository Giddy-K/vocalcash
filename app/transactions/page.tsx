// app/transactions/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TransactionList from '@/components/TransactionList'
import SummaryChart from '@/components/SummaryChart'
import IncomeExpensePie from '@/components/IncomeExpensePie'
import MonthlyTrendChart from '@/components/MonthlyTrendChart'
import { Transaction } from '@/types/transaction'
import Link from 'next/link'

export default async function TransactionsPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

 const {
  data: { user },

} = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }


  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

    
  if (error) {
    redirect('/login')
  }

  const txs = (data ?? []) as Transaction[]

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Transactions</h1>
        <Link
          href="/transactions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          ➕ Add New
        </Link>
      </header>

      <SummaryChart data={txs} />

<MonthlyTrendChart data={txs} />

      <TransactionList data={txs} />
    </main>
  )
}
