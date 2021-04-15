import React from "react"
import {Content, SmallTitle} from "../ModalDialog/modal-dialog"
import styled from "styled-components"
import QueryForm from "./query-form"
import {useSelector} from "react-redux"
import Modal from "../../state/Modal"
import get from "lodash/get"

const StyledContent = styled(Content)`
  min-width: 480px;
`

const EditQueryModal = ({onClose}) => {
  const modalArgs = useSelector(Modal.getArgs)
  const query = get(modalArgs, "query", null)
  return (
    <StyledContent>
      <SmallTitle>Edit Query</SmallTitle>
      <QueryForm query={query} onClose={onClose} />
    </StyledContent>
  )
}

export default EditQueryModal
