import {render} from "react-dom"

import {Pen} from "../types"

export default function reactComponent(renderComponent: any): Pen {
  let root

  function mount(el) {
    root = document.createElement("div")
    if (el.parentNode) {
      el.parentNode.appendChild(root)
    }
  }

  function draw(chart) {
    render(renderComponent(chart), root)
  }

  return {draw, mount}
}
