import React from "react"
import classNames from "classnames"

type Props = {
  className?: string
  show: boolean
  message?: string
}

export default class LoadingMessage extends React.Component<Props> {
  render() {
    return (
      <div
        className={classNames("loading-message", this.props.className, {
          visible: this.props.show
        })}
      >
        {this.props.message || "Loading"}
      </div>
    )
  }
}
