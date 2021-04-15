import React from "react"
import ReactDOM from "react-dom"

import {reactElementProps} from "../test/integration"
import lib from "../lib"

type Props = {children: any}

export default function InfoNotice({children}: Props) {
  return ReactDOM.createPortal(
    <div className="info-notice-wrapper">
      <div className="info-notice" {...reactElementProps("infoNotice")}>
        {children}
      </div>
    </div>,
    lib.doc.id("tooltip-root")
  )
}
