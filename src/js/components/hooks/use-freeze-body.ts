import {useEffect} from "react"

export function useFreezeBody(shouldFreeze) {
  useEffect(() => {
    if (shouldFreeze) {
      document.body.style.pointerEvents = "none"
    } else {
      document.body.style.pointerEvents = ""
    }
    return () => {
      document.body.style.pointerEvents = ""
    }
  }, [shouldFreeze])
}
