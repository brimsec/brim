import React from "react"

type Props = {
  position: "left" | "right"
  onDrag: Function
}

export default class DragAnchor extends React.Component<Props> {
  componentWillUnmount() {
    this.up()
  }

  down = () => {
    const body = document.body
    if (body) {
      body.classList.add("dragging")
      document.addEventListener("mousemove", this.move)
      document.addEventListener("mouseup", this.up)
    }
  }

  move = (e: Event) => {
    this.props.onDrag(e)
  }

  up = () => {
    const body = document.body
    if (body) {
      body.classList.remove("dragging")
      document.removeEventListener("mousemove", this.move)
      document.removeEventListener("mouseup", this.up)
    }
  }

  render() {
    return (
      <div
        className={`drag-anchor drag-anchor-${this.props.position}`}
        onMouseDown={this.down}
      />
    )
  }
}
