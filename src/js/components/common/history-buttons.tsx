import React from "react"
import Back from "../icons/back-arrow.svg"
import Forward from "../icons/forward-arrow.svg"

type Props = {
  prevExists: boolean
  nextExists: boolean
  backFunc: (ClickEvent) => void
  forwardFunc: (ClickEvent) => void
}

export default class HistoryButtons extends React.Component<Props> {
  render() {
    const {prevExists, nextExists, backFunc, forwardFunc} = this.props

    return (
      <div className="history-buttons">
        <button
          className="panel-button back-button"
          disabled={!prevExists}
          onClick={backFunc}
        >
          <Back />
        </button>
        <button
          className="panel-button forward-button"
          onClick={forwardFunc}
          disabled={!nextExists}
        >
          <Forward />
        </button>
      </div>
    )
  }
}
