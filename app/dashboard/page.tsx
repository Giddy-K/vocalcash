// app/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // 1️⃣ Create a server-side Supabase client bound to the cookies for this request
  const supabase = createServerComponentClient({ cookies })

  // 2️⃣ Fetch the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 3️⃣ If no session, send the browser to /login
  if (!session) {
    redirect('/login')
  }

  // 4️⃣ Otherwise render the dashboard
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p className="text-lg">
        Welcome to your dashboard,&nbsp;
        <span className="font-semibold">{session.user.email}</span>!
      </p>

      {/* 👉 Add charts, recent transactions, etc. here */}
    </main>
  )
}
