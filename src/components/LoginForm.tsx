'use client'
import { toast } from 'sonner'
import { doLogin } from '@/actions'
import { Input } from './shadcn/input'
import { Button } from './shadcn/button'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, LoginSchemaType } from '@/utils/FormValidator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './shadcn/form'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginSchemaType) => {
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    try {
      const response = await doLogin(formData)
      if (response && response.error) throw new Error(response.error)
      else {
        toast.success('Login Successful')
        router.push('/')
      }
      //
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }

      console.error(error)
      toast.error('Something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-80 h-[350px] flex flex-col border-input border-2 justify-center px-5 gap-5"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="someone@gmail.com"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="#############"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Login</Button>

        <Link
          href={'/auth/register'}
          className="grid place-items-center"
        >
          <span> Don&apos;t have an account?</span>
        </Link>
      </form>
    </Form>
  )
}
