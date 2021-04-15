import React from "react"
import Arrow from "./icons/chevron-left-md.svg"
import pick from "lodash/pick"
import classNames from "classnames"

type Props = {
  light?: boolean
  dark?: boolean
  expand?: boolean
  collapse?: boolean
  right?: boolean
  left?: boolean
}

export default class PaneToggle extends React.Component<Props> {
  render() {
    const classes = pick(
      this.props,
      "light",
      "dark",
      "collapse",
      "expand",
      "right",
      "left"
    )

    return (
      <button className={classNames("circle-chevron", classes)}>
        <div className="circle">
          <Arrow />
        </div>
      </button>
    )
  }
}
