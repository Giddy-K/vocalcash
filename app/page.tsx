// app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  // 👇 1️⃣  await cookies()  — this satisfies Next’s dynamic-API rule
  const cookieStore = await cookies()

  // 👇 2️⃣ pass a function that returns that same store
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })

  // 3️⃣ fetch session
 const {
  data: { user },
  error,
} = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  if (error) {
    console.log(error)
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">🎙️ VocalCash</h1>
      <p className="text-lg mt-2 text-gray-600 max-w-xl">
        VocalCash lets you track your income and expenses using simple voice
        commands. Sign up to start managing your finances effortlessly.
      </p>

      <div className="mt-6 space-y-4">
        <a
          href="/login"
          className="block bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          🔐 Login
        </a>
        <a
          href="/signup"
          className="block bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition"
        >
          ✍️ Sign Up
        </a>
      </div>
    </main>
  )
}
