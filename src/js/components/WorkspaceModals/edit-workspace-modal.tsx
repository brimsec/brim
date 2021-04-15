import React from "react"
import {useSelector} from "react-redux"
import styled from "styled-components"
import Current from "../../state/Current"
import {Content, SmallTitle} from "../ModalDialog/modal-dialog"
import WorkspaceForm from "./workspace-form"

const StyledContent = styled(Content)`
  min-width: 360px;
`

const EditWorkspaceModal = ({onClose}) => {
  const workspace = useSelector(Current.getWorkspace)

  return (
    <StyledContent>
      <SmallTitle>Edit Workspace</SmallTitle>
      <WorkspaceForm onClose={onClose} workspace={workspace} />
    </StyledContent>
  )
}

export default EditWorkspaceModal
