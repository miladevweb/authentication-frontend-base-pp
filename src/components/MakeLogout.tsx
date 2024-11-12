'use client'
import { doLogout } from '@/actions'
import { useEffect, useState } from 'react'

export default function MakeLogout() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false)
        ;(async () => await doLogout())()
      }, 1500)
    }
  }, [isLoading])

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-screen grid place-items-center fixed top-0 left-0 z-10 bg-slate-950/10 backdrop-blur-sm">
          <div className="w-[400px] h-[200px] rounded-md border-2 border-input grid place-content-center">
            <span className="text-2xl font-medium">You need to login again</span>
          </div>
        </div>
      ) : null}
    </>
  )
}
