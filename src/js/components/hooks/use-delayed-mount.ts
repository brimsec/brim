import {useEffect, useState} from "react"

export default function useDelayedMount(show: boolean, delay: number) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let id
    if (show) {
      id = setTimeout(() => setReady(true), delay)
    } else {
      setReady(false)
    }
    return () => {
      clearTimeout(id)
    }
  }, [show])

  return ready
}
