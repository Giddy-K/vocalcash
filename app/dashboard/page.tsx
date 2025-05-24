// app/dashboard/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  // satisfies Next’s dynamic-API rule
  const cookieStore = await cookies();

  // pass a function that returns that same store
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

  return (
    <main className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action="/logout" method="post">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
          >
            🚪 Logout
          </button>
        </form>
      </div>

      <p className="text-lg mt-2">
        Welcome,&nbsp;
        <span className="font-semibold">{user.email}</span>!
      </p>

      <div className="mt-6 space-y-4">
        <Link
          href="/transactions/new"
          className="block bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          ➕ Add Transaction
        </Link>
        <Link
          href="/transactions"
          className="block bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          📊 View Summary
        </Link>
      </div>
    </main>
  );
}
