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
      const response = await doLogin(formData) // Returns undefined if no error

      if (response && response.error) throw new Error(response.error)
      else router.push('/')
      //
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
        return
      }

      alert('Something went wrong')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-1/2 grid grid-cols-[50%] place-content-center text-black gap-y-3"
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

      <button
        type="submit"
        className="outline outline-2 outline-blue-600 w-1/2 justify-self-center text-blue-600 font-medium text-lg"
      >
        Login
      </button>
    </form>
  )
}
