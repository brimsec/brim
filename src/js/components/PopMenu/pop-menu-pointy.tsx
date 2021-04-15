import React from "react"
import ReactDOM from "react-dom"

import {usePopMenu} from "./use-pop-menu"
import lib from "../../lib"

type Props = {
  children: any
  template: Object[]
  position?: string
}

export default function PopMenuPointy({
  children,
  template,
  position,
  ...props
}: Props) {
  const menu = usePopMenu(children, position)

  return (
    <>
      <PopMenuWrapper
        onClose={menu.close}
        isOpen={menu.isOpen}
        setRef={menu.ref}
        style={menu.style}
      >
        <PopMenuPointer style={menu.pointerStyle} />
        <PopMenuList {...props} template={template} />
      </PopMenuWrapper>
      {menu.anchor}
    </>
  )
}

function PopMenuWrapper({children, onClose, isOpen, setRef, style}) {
  if (!isOpen) return null
  return ReactDOM.createPortal(
    <div className="pop-menu-overlay" onClick={onClose}>
      <div className="pop-menu-wrapper" ref={setRef} style={style}>
        {children}
      </div>
    </div>,
    lib.doc.id("context-menu-root")
  )
}

function PopMenuList({template, ...props}) {
  return (
    <ul {...props}>
      {template.map((item, i) => (
        <PopMenuListItem item={item} key={i} />
      ))}
    </ul>
  )
}

function PopMenuListItem({item}) {
  switch (item.type) {
    case "divider":
      return <hr />
    default:
      if (item.disabled) {
        return <li className="disabled">{item.label}</li>
      } else {
        return <li onClick={item.click}>{item.label}</li>
      }
  }
}

function PopMenuPointer({style}) {
  return (
    <svg style={style} className="pop-menu-pointer" viewBox="0 0 100 50">
      <path d="M0,50 C25,50 40,0 50,0 C60,0 75,50 100,50 Z" />
    </svg>
  )
}
