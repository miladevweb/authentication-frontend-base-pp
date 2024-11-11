'use client'
import { doLogin } from '@/actions'
import { Input } from './shadcn/input'
import { Button } from './shadcn/button'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './shadcn/form'
import { LoginSchema, LoginSchemaType } from '@/utils/FormValidator'
import { toast } from 'sonner'

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
      else router.push('/')
      //
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }
      alert('Something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="someone@gmail.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="##########"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
