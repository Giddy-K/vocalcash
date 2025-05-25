import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Transaction } from '@/types/transaction'


export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (error) {
    console.log(error.message);
  }

    // Fetch transactions for this user, ordered by date desc
const { data: transactions, error: txError } = await supabase
  .from('transactions')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
  .returns<Transaction[]>()        // 👈 this avoids deep-type recursion


  if (txError) {
    console.error(txError.message)
  }

    // Calculate summary stats: income, expenses, balance
  const income = transactions?.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0) ?? 0
  const expenses = transactions?.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0) ?? 0
  const balance = income - expenses

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h1>
        <form action="/logout" method="post">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition shadow-md"
          >
            🚪 Logout
          </button>
        </form>
      </div>

      <p className="text-lg mt-2 text-gray-600">
        Hello, <span className="font-semibold text-gray-800">{user.email}</span>
      </p>

 {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-10">
        <div className="bg-green-100 p-4 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-green-700">Income</h2>
          <p className="text-2xl font-bold text-green-900">
            {income.toLocaleString(undefined, { style: 'currency', currency: 'KES' })}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-red-700">Expenses</h2>
          <p className="text-2xl font-bold text-red-900">
            {expenses.toLocaleString(undefined, { style: 'currency', currency: 'KES' })}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold text-blue-700">Balance</h2>
          <p className="text-2xl font-bold text-blue-900">
            {balance.toLocaleString(undefined, { style: 'currency', currency: 'KES' })}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/transactions/new"
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl text-center hover:bg-blue-700 transition font-medium shadow-md"
        >
          ➕ Add Transaction
        </Link>
        <Link
          href="/transactions"
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl text-center hover:bg-green-700 transition font-medium shadow-md"
        >
          📊 View Summary
        </Link>
      </div>
    </main>
  );
}
