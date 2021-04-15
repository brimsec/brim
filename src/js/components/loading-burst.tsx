import React from "react"
import classNames from "classnames"

type Props = {show: boolean}

export default class LoadingBurst extends React.Component<Props> {
  render() {
    return (
      <div
        className={classNames("loading-burst", {
          visible: this.props.show
        })}
      >
        <div className="burst-1 burst" />
        <div className="burst-2 burst" />
      </div>
    )
  }
}
