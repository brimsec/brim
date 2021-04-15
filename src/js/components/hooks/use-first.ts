import {useEffect, useRef} from "react"

/*
A hook to do something the "first" time a condition is met. They
way you defined first is provided in the condition
*/
export default function useFirst(cond: boolean) {
  const first = useRef(true)

  useEffect(() => {
    if (first.current && !cond) first.current = false
  }, [cond])

  return first.current
}
