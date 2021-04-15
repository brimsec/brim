import React from "react"
import {Content, SmallTitle} from "../ModalDialog/modal-dialog"
import QueryForm from "./query-form"
import {useSelector} from "react-redux"
import Modal from "../../state/Modal"
import get from "lodash/get"

const NewQueryModal = ({onClose}) => {
  const modalArgs = useSelector(Modal.getArgs)
  const value = get(modalArgs, "value", null)
  return (
    <Content>
      <SmallTitle>New Query</SmallTitle>
      <QueryForm value={value} onClose={onClose} />
    </Content>
  )
}
export default NewQueryModal
