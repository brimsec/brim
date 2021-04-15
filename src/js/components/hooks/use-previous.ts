import {useEffect, useState} from "react"

export default function usePrevious(val: any, keys: any) {
  const [prev, setPrev] = useState(val)

  useEffect(() => {
    setPrev(val)
  }, keys)

  return prev
}
