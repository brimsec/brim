import React, {useEffect, useLayoutEffect, useRef, useState} from "react"

import {layoutPopMenu} from "./layout"

export function usePopMenu(children: any, position = "left bottom") {
  const anchorRef = useRef<HTMLElement>()
  const menuRef = useRef<HTMLElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [style, setStyle] = useState({})
  const [pointerStyle, setPointerStyle] = useState({})

  const child = React.Children.only(children)
  const anchor = React.cloneElement(child, {ref: anchorRef})

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  useEffect(() => {
    const a = anchorRef.current
    if (!a) return

    a.addEventListener("click", open)
    return () => a.removeEventListener("click", open)
  }, [])

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const menu = menuRef.current
    if (!anchor || !menu) return

    const pop = layoutPopMenu(anchor, menu, position)
    setStyle(pop.wrapperStyle)
    setPointerStyle(pop.pointerStyle)
    pop.animate()
  }, [isOpen])

  return {anchor, open, close, isOpen, ref: menuRef, style, pointerStyle}
}
