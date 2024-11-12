import Link from 'next/link'
import { auth } from '@/lib/auth'
import MakeLogout from '@/components/MakeLogout'
import * as NextAuth from '@/components/NextAuth'

export default async function Page() {
  const session = await auth()
  if (!session || !session.user || session.error === 'RefreshTokenError') return <MakeLogout />

  return (
    <div>
      <pre>{JSON.stringify(session?.user?.access, null, 2)}</pre>

      <Link href={'/contact'}>Contact</Link>

      <NextAuth.SignOut />
    </div>
  )
}
