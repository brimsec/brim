import {useEffect, useState} from "react"

export default function useResizeObserver(
  ref: React.MutableRefObject<Element | null>
) {
  const node = ref.current
  const [state, setState] = useState({height: 0, width: 0})

  useEffect(() => {
    // @ts-ignore
    const ro = new ResizeObserver((entries) => {
      const {width, height} = entries[0].contentRect
      setState({width, height})
    })
    if (node) ro.observe(node)
    return () => {
      if (node) ro.unobserve(node)
    }
  }, [node])

  return state
}
