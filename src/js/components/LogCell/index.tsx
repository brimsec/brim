import React, {useState} from "react"
import classNames from "classnames"

import {RightClickBuilder} from "../../types"
import CompoundField from "./compound-field"
import SingleField from "./single-field"
import Tooltip from "../Tooltip"
import {zng} from "zealot"

type Props = {
  field: zng.Field
  log: zng.Record
  style?: Object
  rightClick: RightClickBuilder
}

const getTooltipStyle = (el: Element) => {
  if (!el) return {}
  const {top, left} = el.getBoundingClientRect()
  return {top: top - 21, left: left + 4}
}

export default function LogCell({field, style, rightClick, log}: Props) {
  const [hover, setHover] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const {name, data} = field

  function handleMouseEnter(e) {
    setHover(true)
    setTooltipStyle(getTooltipStyle(e.currentTarget))
  }

  function handleMouseLeave() {
    setHover(false)
  }
  return (
    <div
      className={classNames(`log-cell ${data.getType()}`, {hover})}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <FieldSwitch field={field} log={log} menuBuilder={rightClick} />
      {hover && (
        <Tooltip style={tooltipStyle}>
          <span className="field-name">{name}</span>
        </Tooltip>
      )}
    </div>
  )
}

type FieldSwitchProps = {
  field: zng.Field
  log: zng.Record
  menuBuilder: RightClickBuilder
}

function FieldSwitch({field, log, menuBuilder}: FieldSwitchProps) {
  if (field.data instanceof zng.Primitive) {
    const menu = menuBuilder(field, log, false)
    return <SingleField field={field} menu={menu} record={log} />
  } else {
    return (
      <CompoundField
        field={field as zng.ContainerField}
        log={log}
        menuBuilder={menuBuilder}
      />
    )
  }
}
