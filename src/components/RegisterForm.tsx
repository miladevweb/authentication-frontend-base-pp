'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, RegisterSchemaType } from '@/utils/FormValidator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/shadcn/form'

export default function RegisterForm() {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      thumbnail: undefined,
    },
  })

  const onSubmit = (values: RegisterSchemaType) => {
    console.log(values)
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

        <Button type="submit">Login</Button>

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
