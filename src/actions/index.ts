'use server'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signOut, signIn } from '@/lib/auth'

export async function doLogout() {
  await signOut({ redirect: false })
  redirect('/auth/login')
}

export async function doRegister(formData: FormData) {
  try {
    const response = await fetch(process.env.API_SERVER_BASE_URL + '/register', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    revalidatePath('/')
    return
    //
  } catch (error) {
    if (error instanceof Error) return { error: error.message }
    return { error: 'Something went wrong' }
  }
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
