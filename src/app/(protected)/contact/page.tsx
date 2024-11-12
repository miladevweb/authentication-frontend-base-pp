import Link from 'next/link'
import { auth } from '@/lib/auth'
import MakeLogout from '@/components/MakeLogout'

export default async function Page() {
  const session = await auth()

  if (!session || !session.user || session.error === 'RefreshTokenError') return <MakeLogout />
  
  return (
    <div>
      <Link href={'/'}>Home</Link>
    </div>
  )
}
