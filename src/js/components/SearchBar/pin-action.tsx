import {useDispatch} from "react-redux"
import React from "react"

import InputAction from "./input-action"
import PinIcon from "../../icons/pin-border-icon"
import SearchBar from "../../state/SearchBar"

export default function PinAction() {
  const dispatch = useDispatch()
  const onClick = () => dispatch(SearchBar.pinSearchBar())

  return (
    <InputAction onClick={onClick}>
      <PinIcon />
    </InputAction>
  )
}
