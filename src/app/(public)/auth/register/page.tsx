import RegisterForm from '@/components/RegisterForm'

export default function Page() {
  return (
    <div className="h-screen bg-gradient-to-b from-50% from-background to-[hsl(165deg,20%,3%)] grid place-content-center">
      <RegisterForm />
    </div>
  )
}