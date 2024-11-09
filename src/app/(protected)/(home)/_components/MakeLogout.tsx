'use client'
import { useEffect } from 'react'
import { doLogout } from '@/actions'

export default function MakeLogout() {
  useEffect(() => {
    (async () => await doLogout())()
  }, [])

  return null
}
