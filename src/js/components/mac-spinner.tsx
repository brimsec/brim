import React from "react"
import classNames from "classnames"

type Props = {light?: boolean}

export default function MacSpinner({light}: Props) {
  return (
    <div className={classNames("mac-spinner", {light})}>
      <div className="bar-container">
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>
    </div>
  )
}
