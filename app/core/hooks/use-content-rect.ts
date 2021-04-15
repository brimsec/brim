import {useState, useLayoutEffect} from "react"

export default function useContentRect(): [
  DOMRectReadOnly,
  (node: HTMLElement) => void
] {
  const [contentRect, setContentRect] = useState<DOMRectReadOnly>(
    new DOMRectReadOnly()
  )
  const [node, setNode] = useState(null)

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setContentRect(entry.contentRect)
    })
    if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return [contentRect, setNode]
}
