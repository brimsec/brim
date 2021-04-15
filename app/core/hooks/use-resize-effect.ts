import {useLayoutEffect} from "react"

type Callback = (DOMRectReadOnly) => void

export default function useResizeEffect<T extends Element>(
  node: T | null,
  cb: Callback,
  deps: any[] = []
): void {
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => cb(entry.contentRect))
    if (node) observer.observe(node)
    return () => observer.disconnect()
  }, [node, ...deps])
}
