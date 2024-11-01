import { signIn, signOut } from '@/lib/auth'

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn()
      }}
    >
      <button type="submit">Sign In</button>
    </form>
  )
}

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
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
