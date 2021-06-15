import React from "react"

import {shell} from "electron"

type Props = {href?: string; children: JSX.Element | string; onClick?: Function}

export default function Link({href, onClick, children}: Props) {
  // Anchors can be passed through
  if (href?.startsWith("#")) return <a href={href}>{children}</a>

  const click = (e) => {
    e.preventDefault()
    if (href) {
      shell.openExternal(href)
    } else if (onClick) {
      onClick(e)
    }
  }
  return (
    <a
      href={
        ""
        /* triggers underline style */
      }
      onClick={click}
      tabIndex={0}
    >
      {children}
    </a>
  )
}
