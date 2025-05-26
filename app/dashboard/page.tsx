export const dynamic = 'force-dynamic'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Transaction } from '@/types/transaction'
import IncomeExpensePie from '@/components/IncomeExpensePie'

/* ---------- utility: per-card color classes ---------- */
const CARD_COLORS = {
  green: {
    bg: 'from-green-100 to-green-200',
    ring: 'ring-green-300',
    text: 'text-green-700',
    textBold: 'text-green-900',
    hover: 'hover:from-green-200 hover:to-green-300',
  },
  red: {
    bg: 'from-red-100 to-red-200',
    ring: 'ring-red-300',
    text: 'text-red-700',
    textBold: 'text-red-900',
    hover: 'hover:from-red-200 hover:to-red-300',
  },
  blue: {
    bg: 'from-blue-100 to-blue-200',
    ring: 'ring-blue-300',
    text: 'text-blue-700',
    textBold: 'text-blue-900',
    hover: 'hover:from-blue-200 hover:to-blue-300',
  },
} as const
type CardColor = keyof typeof CARD_COLORS

export default async function DashboardPage() {
    const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  /* ------------- Auth ------------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) redirect('/login')

  /* ------------- Data ------------- */
  const { data, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .returns<Transaction[]>()

  if (txError) console.error(txError.message)
  const transactions: Transaction[] = data ?? []

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses
  const latest = transactions[0]

  /* ------------- Greeting ------------- */
  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning ☀️'
    if (h < 18) return 'Good afternoon 🌤️'
    return 'Good evening 🌙'
  }

  /* ------------- JSX ------------- */
  return (
    <main className="p-6 max-w-4xl mx-auto">
      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-200">
          {getGreeting()},{' '}
          <span className="font-semibold">
            {user.user_metadata?.full_name || user.email}
          </span>{' '}
          👋
        </h1>
        <form action="/logout" method="post">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow transition"
          >
            🚪 Logout
          </button>
        </form>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[
          { label: 'Income', value: income, color: 'green' },
          { label: 'Expenses', value: expenses, color: 'red' },
          { label: 'Balance', value: balance, color: 'blue' },
        ].map(({ label, value, color }) => {
          const c = CARD_COLORS[color as CardColor]
          return (
            <div
              key={label}
              className={`
                bg-gradient-to-br ${c.bg} ${c.hover}
                p-6 rounded-xl shadow
                ring-1 ${c.ring}
                text-center flex flex-col items-center justify-center
                transition-transform duration-300 hover:scale-105
              `}
            >
              <h2 className={`text-xl font-semibold ${c.text} mb-2`}>
                {label}
              </h2>
              <p className={`text-3xl font-mono font-extrabold ${c.textBold}`}>
                {value.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'KES',
                })}
              </p>
            </div>
          )
        })}
      </div>

      {/* empty-state notice */}
      {transactions.length === 0 && (
        <p className="mt-6 text-center text-gray-500">
          No transactions yet. Start by adding one below.
        </p>
      )}

      {/* latest */}
      {latest && (
        <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            📌 Latest Transaction
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-800 dark:text-gray-100">
              {latest.note || latest.category || '—'}
            </p>
            <p
              className={`font-bold ${
                latest.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {latest.amount.toLocaleString(undefined, {
                style: 'currency',
                currency: 'KES',
              })}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(latest.created_at).toLocaleString()}
          </p>
        </div>
      )}

      {/* action buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/transactions/new"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-center font-medium shadow-lg transition"
        >
          ➕ Add Transaction
        </Link>
        <Link
          href="/transactions"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-center font-medium shadow-lg transition"
        >
          📊 View Summary
        </Link>
      </div>

      {/* overview chart */}
      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          📈 Overview Chart
        </h3>
        <p className="text-gray-500 dark:text-gray-400 italic mb-4">
          Visual summary of your income & expenses
        </p>
        <IncomeExpensePie data={transactions} />
      </div>
    </main>
  )
}
