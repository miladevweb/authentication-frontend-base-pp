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
      }, 2000)
    }
  }, [isLoading])

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-screen grid place-items-center">
          <div className="w-[400px] h-[200px] rounded-md border-2 border-input grid place-content-center">
            <span className="text-2xl font-medium">You need to login again</span>
          </div>
        </div>
      ) : null}
    </>
  )
}
