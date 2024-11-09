import Image from 'next/image'
import { auth } from '@/lib/auth'
import * as NextAuth from '@/components/NextAuth'
import SignOutLogic from './_components/SignOutLogic'

export default async function Page() {
  const session = await auth()

  if (!session || !session.user || session.error === 'RefreshTokenError') return <SignOutLogic />

  return (
    <div>
      <pre>{JSON.stringify(session.user.access, null, 2)}</pre>

      <picture className="size-60">
        <Image
          alt={session.user.name!}
          src={session.user.image!}
          //
          fill
          priority
          sizes="20vw"
          className="rounded-full"
        />
      </picture>

      <NextAuth.SignOut />
    </div>
  )
}
