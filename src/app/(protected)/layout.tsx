import { auth } from '@/lib/auth'
import MakeLogout from './(home)/_components/MakeLogout'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || !session.user || session.error === 'RefreshTokenError') return <MakeLogout />

  return <>{children}</>
}
