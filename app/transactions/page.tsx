export const dynamic = 'force-dynamic'

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import TransactionList from "@/components/TransactionList";
import SummaryChart from "@/components/SummaryChart";
import MonthlyTrendChart from "@/components/MonthlyTrendChart";
import { Transaction } from "@/types/transaction";

export default async function TransactionsPage() {
  /* auth & data */
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) redirect("/login");

  const txs = (data ?? []) as Transaction[];

  /* layout */
  return (
    <main className="p-6 space-y-8">
      {/* header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Your Transactions
        </h1>
        <Link
          href="/transactions/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Add New
        </Link>
      </header>

      {/* charts row */}
      {txs.length > 0 ? (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="min-h-[350px]">
            <SummaryChart data={txs} />
          </div>
          <div className="min-h-[350px]">
            <MonthlyTrendChart data={txs} />
          </div>
        </section>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No transactions yet. Click&nbsp;
          <Link href="/transactions/new" className="underline text-blue-600">
            Add New
          </Link>{" "}
          to get started!
        </p>
      )}

      {/* table */}
      <section>
        <TransactionList data={txs} />
      </section>
    </main>
  );
}
