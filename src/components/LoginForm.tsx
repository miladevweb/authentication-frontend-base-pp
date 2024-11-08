'use client'
import { FormEvent } from 'react'
import { doLogin } from '@/actions'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement)

      const response = await doLogin(formData)

      if (!!response.error) {
        console.log(response.error, 'response.error 🔥')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error(error, 'error 🔥')
      alert('Something went wrong')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-[50%] place-content-center text-black"
    >
      <input
        type="email"
        name="email"
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
      />

      <button type="submit">Login</button>
    </form>
  )
}
