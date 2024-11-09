'use client'
import { useEffect } from 'react'
import { doLogout } from '@/actions'

export default function SignOutLogic() {
  useEffect(() => {
    (async () => await doLogout())()
  }, [])

  return null
}
