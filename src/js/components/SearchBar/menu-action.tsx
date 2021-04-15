import {useDispatch, useSelector} from "react-redux"
import React from "react"

import {reactElementProps} from "../../test/integration"
import Handlers from "../../state/Handlers"
import InputAction from "./input-action"
import Modal from "../../state/Modal"
import PopMenuPointy from "../PopMenu/pop-menu-pointy"
import Tab from "../../state/Tab"
import ThreeDotsIcon from "../../icons/three-dots-icon"
import open from "../../lib/open"

export default function MenuAction() {
  const dispatch = useDispatch()
  const isFetching = useSelector(Tab.isFetching)

  const menu = [
    {label: "Debug query", click: () => dispatch(Modal.show("debug"))},
    {label: "Copy for curl", click: () => dispatch(Modal.show("curl"))},
    {label: "Copy for zq", click: () => dispatch(Modal.show("zq"))},
    {
      label: "Syntax docs",
      click: () =>
        open("https://github.com/brimdata/zed/tree/main/docs/language")
    },
    {
      label: "Kill search",
      click: () => dispatch(Handlers.abortAll()),
      disabled: !isFetching
    }
  ]

  return (
    <PopMenuPointy template={menu} {...reactElementProps("optionsMenu")}>
      <InputAction>
        <ThreeDotsIcon />
      </InputAction>
    </PopMenuPointy>
  )
}
