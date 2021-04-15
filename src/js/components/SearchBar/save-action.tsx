import {useDispatch, useSelector} from "react-redux"
import React from "react"

import InputAction from "./input-action"
import SearchBar from "../../state/SearchBar"
import Modal from "../../state/Modal"
import StarNoFillIcon from "../../icons/star-no-fill-icon"

export default function SaveAction() {
  const dispatch = useDispatch()
  const searchContents = useSelector(SearchBar.getSearchBarInputValue)
  const onClick = () =>
    dispatch(Modal.show("new-query", {value: searchContents}))

  return (
    <InputAction onClick={onClick}>
      <StarNoFillIcon />
    </InputAction>
  )
}
