'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signOut, signIn } from '@/lib/auth'

export async function doLogout() {
  await signOut({ redirect: false })
  redirect('/auth/login')
}

export async function doLogin(formData: FormData) {
  try {
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })

    revalidatePath('/')
    return response
  } catch (error) {
    throw error
  }
}
