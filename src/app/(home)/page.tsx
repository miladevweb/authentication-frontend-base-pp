import { auth } from '@/lib/auth'
import * as NextAuth from '@/components/NextAuth'
import SignOutLogic from './_components/SignOutLogic'

export default async function Page() {
  const session = await auth()

  if (session?.error === 'RefreshTokenError') {
    return <SignOutLogic />
  }

  if (!session || !session.user) return <NextAuth.SignIn />

  // const { name, image } = session.user

  return (
    <div>
      <pre>{JSON.stringify(session.user.access, null, 2)}</pre>

      <picture className="size-60">
        {/* <Image
          alt={name!}
          src={image!}
          //
          fill
          priority
          sizes="20vw"
          className="rounded-full"
        /> */}
      </picture>

      <NextAuth.SignOut />
    </div>
  )
}
