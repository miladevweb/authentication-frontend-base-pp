import Image from 'next/image'
import { auth } from '@/lib/auth'

export default async function Navbar() {
  const session = await auth()
  if (!session || !session.user) return null

  const { name, image, email } = session.user

  return (
    <nav className="flex justify-between items-center h-16 px-5 border-b-2 border-input">
      <h2 className="text-3xl font-medium">{name}</h2>

      <span className="text-lg font-light">{email}</span>

      <picture className="size-10">
        <Image
          alt={name!}
          src={image!}
          //
          fill
          loading="lazy"
          className="rounded-full"
          sizes="(max-width: 640px) 10vw, 5vw"
        />
      </picture>
    </nav>
  )
}
