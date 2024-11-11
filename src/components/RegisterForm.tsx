'use client'
import Link from 'next/link'
import { toast } from 'sonner'
import { doRegister } from '@/actions'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, RegisterSchemaType } from '@/utils/FormValidator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form'

export default function RegisterForm() {
  const router = useRouter()

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      thumbnail: undefined,
    },
  })

  const onSubmit = async (values: RegisterSchemaType) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('email', values.email)
    formData.append('password', values.password)
    formData.append('image', values.thumbnail)

    try {
      const response = await doRegister(formData)
      if (response && response.error) throw new Error(response.error)
      else {
        toast.success('Registered successfully - Please login')
        router.push('/auth/login')
      }

      //
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        toast.error(error.message)
        return
      }

      console.log(error)
      toast.error('Something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-80 h-[500px] flex flex-col border-input border-2 justify-center px-5 gap-5"
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

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Anonymous"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="thumbnail"
          control={form.control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel htmlFor="picture">Thumbnail</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  id="picture"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null
                    onChange(file)
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Register</Button>

        <Link
          href={'/auth/login'}
          className="grid place-items-center"
        >
          <span> You have an account?</span>
        </Link>
      </form>
    </Form>
  )
}
