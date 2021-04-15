import {isEqual} from "lodash"
import * as React from "react"
import {useState} from "react"
import brim, {Ts} from "../../brim"
import {isString} from "../../lib/is"
import {TimeArg} from "../../state/Search/types"
import Animate from "../Animate"
import MenuBarButton from "../menu-bar-button"
import TimeInput from "./time-input"
import TimePiece from "./time-piece"

type Props = {
  timeArg: TimeArg
  prevTimeArg: TimeArg | null | undefined
  onChange: Function
  icon?: React.ReactNode
}

export default function TimeButton({
  timeArg,
  prevTimeArg,
  onChange,
  icon
}: Props) {
  const [editing, setEditing] = useState(false)
  const dirty = !!prevTimeArg && !isEqual(timeArg, prevTimeArg)
  function onClick() {
    setEditing(true)
  }

  function onSubmit(date) {
    onChange(date)
    setEditing(false)
  }

  function reset(e) {
    e.stopPropagation()
    if (prevTimeArg) {
      onChange(prevTimeArg)
    }
  }

  if (editing) return <TimeInput timeArg={timeArg} onSubmit={onSubmit} />
  return (
    <div className={"time-picker-button"} onClick={onClick}>
      <MenuBarButton onFocus={() => setEditing(true)} icon={icon}>
        {isString(timeArg) ? (
          brim.relTime(timeArg).format()
        ) : (
          <TimeDisplay ts={timeArg} />
        )}
      </MenuBarButton>
      <ChangedDot show={dirty} onClick={reset} />
    </div>
  )
}

function ChangedDot({show, onClick}) {
  const enter = {scale: [0, 1]}
  return (
    <Animate show={show} enter={enter}>
      <div className="changed-dot" onClick={onClick} />
    </Animate>
  )
}

type TDProps = {ts: Ts}
function TimeDisplay({ts}: TDProps) {
  const t = brim.time(ts)
  return (
    <>
      <TimePiece data-unit="month">{t.format("MMM")}</TimePiece>
      <TimePiece data-unit="day">{t.format("DD")}</TimePiece>,
      <TimePiece data-unit="year">{t.format("YYYY")}</TimePiece>
      <TimePiece data-unit="hour">{t.format("HH")}</TimePiece>:
      <TimePiece data-unit="minute">{t.format("mm")}</TimePiece>:
      <TimePiece data-unit="second">{t.format("ss")}</TimePiece>
    </>
  )
}
