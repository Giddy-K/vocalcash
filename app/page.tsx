import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Landing from '@/components/Landing'

export default async function HomePage() {
    const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')
  if (error && error.status !== 400) console.error(error)

  return <Landing />
}
