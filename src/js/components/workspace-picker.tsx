import useWorkspaceId from "app/router/hooks/use-workspace-id"
import tabHistory from "app/router/tab-history"
import {lakeImportPath} from "app/router/utils/paths"
import {MenuItemConstructorOptions} from "electron"
import React, {ComponentType} from "react"
import {useDispatch, useSelector} from "react-redux"
import styled from "styled-components"
import DropdownArrow from "../icons/dropdown-arrow"
import {showContextMenu} from "../lib/System"
import Current from "../state/Current"
import Modal from "../state/Modal"
import {AppDispatch} from "../state/types"
import Workspaces from "../state/Workspaces"
import {Workspace} from "../state/Workspaces/types"

const WorkspacePickerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 11px 12px;
  user-select: none;

  label {
    ${(props) => props.theme.typography.labelBold};
    color: var(--aqua);
  }

  svg {
    height: 11px;
    width: 11px;
    stroke: var(--slate);
    margin-left: 6px;
  }
` as ComponentType<any>

const showWorkspaceMenu = () => (dispatch, getState) => {
  const workspaces = Workspaces.all(getState())
  const currentId = Current.getWorkspaceId(getState())

  const template: MenuItemConstructorOptions[] = [
    {
      label: "Get Info",
      click: () => dispatch(Modal.show("view-workspace"))
    },
    {type: "separator"}
  ]

  workspaces.forEach((w: Workspace) => {
    const isCurrent = w.id === currentId
    template.push({
      type: "checkbox",
      label: w.name,
      checked: isCurrent,
      click: () => {
        if (isCurrent) return
        dispatch(tabHistory.push(lakeImportPath(w.id)))
      }
    })
  })

  template.push(
    {type: "separator"},
    {
      label: "Add Workspace...",
      click: () => dispatch(Modal.show("new-workspace"))
    }
  )

  showContextMenu(template)
}

export default function WorkspacePicker() {
  const dispatch = useDispatch<AppDispatch>()
  const workspaceId = useWorkspaceId()
  const current = useSelector(Workspaces.id(workspaceId))
  return (
    <WorkspacePickerWrapper onClick={() => dispatch(showWorkspaceMenu())}>
      <label>{`${current?.name}`}</label>
      <DropdownArrow />
    </WorkspacePickerWrapper>
  )
}
