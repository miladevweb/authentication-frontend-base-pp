'use client'
import { useEffect } from 'react'
import { doLogout } from '@/actions'

export default function SignOutLogic() {
  useEffect(() => {
    const some = async () => {
      await doLogout()
    }
    some()
  }, [])

  return <></>
}
