import React, {useEffect, useRef, useState} from "react"
import classNames from "classnames"

import {$Menu} from "../../electron/menu"
import {showContextMenu} from "../../lib/System"
import FieldCell from "../field-cell"
import lib from "../../lib"
import {zng} from "zealot"

type Props = {
  field: zng.Field
  record: zng.Record
  menu: $Menu
}

const on = document.addEventListener
const off = document.removeEventListener

export default function SingleField({field, menu, record}: Props) {
  const [selected, setSelected] = useState(false)
  const cell = useRef<any>()

  function onClick(e) {
    setSelected(true)
    lib.win.selectText(e.currentTarget)
  }

  function onOutsideClick(e: MouseEvent) {
    if (cell.current && cell.current.contains(e.target)) return
    setSelected(false)
    off("click", onOutsideClick, false)
  }

  useEffect(() => {
    if (selected) {
      on("click", onOutsideClick, false)
    }
    return () => {
      off("click", onOutsideClick, false)
    }
  }, [selected])

  return (
    <div
      ref={cell}
      className={classNames("cell-value-item", {selected})}
      onClick={onClick}
      onContextMenu={() => showContextMenu(menu)}
    >
      <FieldCell field={field} record={record} />
    </div>
  )
}
