import { signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

export function SignIn() {
  return (
    <input
      type="submit"
      value={'Sign In'}
      className="border-[3px] border-blue-500 text-blue-500 font-medium text-lg px-4 py-1 rounded-lg"
    />
  )
}

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirect: false })
        redirect('/auth/login')
      }}
    >
      <button
        type="submit"
        className="border-[3px] border-rose-500 text-rose-500 font-medium text-lg px-4 py-1 rounded-lg"
      >
        Sign out
      </button>
    </form>
  )
}
