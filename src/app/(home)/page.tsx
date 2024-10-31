// import Image from 'next/image'
import { auth } from '@/lib/auth'
import * as NextAuth from '@/components/NextAuth'

export default async function Page() {
  const session = await auth()
  if (!session || !session.user) return <NextAuth.SignIn />

  // const { name, image } = session.user

  return (
    <div>
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
