import {useSelector, useDispatch} from "react-redux"
import Modal from "../state/Modal"
import {DebugModal} from "./debug-modal"
import IngestWarningsModal from "./ingest-warnings-modal"
import WhoisModal from "./whois-modal"
import ZQModal from "./zq-modal"
import CurlModal from "./curl-modal"
import React from "react"
import {ModalDialog} from "./ModalDialog/modal-dialog"
import NewWorkspaceModal from "./WorkspaceModals/new-workspace-modal"
import ViewWorkspaceModal from "./WorkspaceModals/view-workspace-modal"
import NewQueryModal from "./QueriesModals/new-query-modal"
import EditQueryModal from "./QueriesModals/edit-query-modal"
import ExportModal from "./export-modal"

const MODALS = {
  debug: DebugModal,
  whois: WhoisModal,
  curl: CurlModal,
  zq: ZQModal,
  "ingest-warnings": IngestWarningsModal,
  "new-workspace": NewWorkspaceModal,
  "view-workspace": ViewWorkspaceModal,
  "new-query": NewQueryModal,
  export: ExportModal,
  "edit-query": EditQueryModal
}

export function Modals() {
  const name = useSelector(Modal.getName)
  const dispatch = useDispatch()
  const modal = MODALS[name]

  if (!modal) return null
  return (
    <ModalDialog onClosed={() => dispatch(Modal.hide())}>{modal}</ModalDialog>
  )
}
