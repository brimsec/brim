import {useSelector} from "react-redux"
import React from "react"

import {ModalBoxProps} from "./types"
import Animate from "../Animate"
import ModalContents from "./modal-contents"
import modal from "../../state/Modal"

export default function ModalBox({name, children, ...props}: ModalBoxProps) {
  const active = useSelector(modal.getName)

  function enter(anime, el) {
    return anime
      .timeline({
        duration: 150
      })
      .add({
        targets: document.querySelector(".modal-overlay"),
        backgroundColor: ["rgba(38,37,36,0.0)", "rgba(38,37,36,0.15)"],
        easing: "linear"
      })
      .add(
        {
          targets: el.querySelector(".modal-contents"),
          opacity: {
            value: [0, 1],
            easing: "easeInOutSine"
          },
          scale: [0.8, 1],
          easing: "easeInOutSine"
        },
        0
      )
  }

  return (
    <Animate show={active === name} enter={enter}>
      <ModalContents {...props}>{children}</ModalContents>
    </Animate>
  )
}
