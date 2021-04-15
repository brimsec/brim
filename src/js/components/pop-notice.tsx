import React, {useState} from "react"
import {popNoticeLocator} from "../test/locators"
import useEventListener from "./hooks/use-event-listener"
import {Notice} from "./Notice"

export function PopNotice() {
  const [show, setShow] = useState(false)
  const [text, setText] = useState("")

  useEventListener(
    window,
    "brim:notice",
    (e: CustomEvent) => {
      setText(e.detail)
      setShow(true)
    },
    []
  )

  if (!show) return null
  return (
    <Notice
      text={text}
      onDone={() => setShow(false)}
      {...popNoticeLocator.props}
    />
  )
}

export const popNotice = (text) => {
  dispatchEvent(new CustomEvent("brim:notice", {detail: text}))
}
