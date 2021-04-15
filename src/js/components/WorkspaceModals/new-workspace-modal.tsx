import React from "react"
import {Content, SmallTitle} from "../ModalDialog/modal-dialog"
import WorkspaceForm from "./workspace-form"

const NewWorkspaceModal = ({onClose}) => {
  return (
    <Content>
      <SmallTitle>New Workspace</SmallTitle>
      <WorkspaceForm onClose={onClose} />
    </Content>
  )
}
export default NewWorkspaceModal
