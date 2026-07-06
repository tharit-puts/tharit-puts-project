import { useEffect, useState } from 'react'
import { LOADING_DELAY } from '@/lib/loading'

export function usePageLoading(deps = [], delay = LOADING_DELAY.page) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), delay)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return isLoading
}
