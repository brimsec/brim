import {useCallback, useState} from "react"

export default function useCallbackRef<T = Element>(): [
  T,
  (e: T | null) => T | null
] {
  const [node, setNode] = useState(null)

  const cb = useCallback((node) => {
    if (node !== null) setNode(node)
    return node
  }, [])

  return [node, cb]
}
