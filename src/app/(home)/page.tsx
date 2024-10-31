import Image from 'next/image'
import { auth } from '@/lib/auth'
import * as NextAuth from '@/components/NextAuth'

export default async function Page() {
  const session = await auth()
  if (!session || !session.user) return null

  console.log(session)
  const { name, image } = session.user

  return (
    <div>
      <NextAuth.SignIn />

      <picture className="size-60">
        <Image
          alt={name!}
          src={image!}
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
