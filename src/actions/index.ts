'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signOut, signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function doLogout() {
  await signOut({ redirect: false })
  redirect('/auth/login')
}

export async function doLogin(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })

    revalidatePath('/')
    return
    //
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message }
    }
    return { error: 'Invalid Credentials' }
  }
}
