// app/signup/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import SignupForm from './SignupForm'

export default async function SignupPage() {
    const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <SignupForm />
}
