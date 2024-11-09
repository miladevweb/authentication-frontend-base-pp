import Image from 'next/image'
import { auth } from '@/lib/auth'
import * as NextAuth from '@/components/NextAuth'

export default async function Page() {
  const session = await auth()
  const { access, name, image } = session!.user!

  return (
    <div>
      <pre>{JSON.stringify(access, null, 2)}</pre>

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
