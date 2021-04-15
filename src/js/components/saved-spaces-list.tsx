import {lakeSummaryPath} from "app/router/utils/paths"
import showSpaceContextMenu from "app/spaces/flows/show-space-context-menu"
import classNames from "classnames"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {useHistory} from "react-router"
import styled from "styled-components"
import brim from "../brim"
import FileFilled from "../icons/file-filled"
import Current from "../state/Current"
import {Space} from "../state/Spaces/types"
import {AppDispatch} from "../state/types"
import {WorkspaceStatus} from "../state/WorkspaceStatuses/types"
import {currentSpaceItem, spaceItem} from "../test/locators"
import EmptySection from "./common/empty-section"
import ProgressIndicator from "./progress-indicator"
import SpaceIcon from "./space-icon"

type Props = {
  spaces: Space[]
  workspaceStatus: WorkspaceStatus
}

const NameWrap = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  overflow: hidden;
`

const SpaceListItem = ({space}: {space: Space}) => {
  const dispatch = useDispatch<AppDispatch>()
  const workspaceId = useSelector(Current.getWorkspaceId)
  const currentSpaceId = useSelector(Current.getSpaceId)

  const s = brim.space(space)
  const history = useHistory()
  const onClick = (e) => {
    e.preventDefault()
    history.push(lakeSummaryPath(s.id, workspaceId))
  }

  const progress = s.ingesting() && (
    <div className="small-progress-bar">
      <ProgressIndicator percent={s.ingestProgress()} />
    </div>
  )
  const current = s.id === currentSpaceId
  const testProps = current ? currentSpaceItem.props : spaceItem.props
  return (
    <li>
      <a
        href="#"
        onClick={onClick}
        onContextMenu={() => dispatch(showSpaceContextMenu(s))}
        className={classNames("space-link", {"current-space-link": current})}
        {...testProps}
      >
        <NameWrap>
          <SpaceIcon type={s.getType()} className="space-icon" />
          <span className="name">{s.name}</span>
        </NameWrap>
        {progress}
      </a>
    </li>
  )
}

export default function SavedSpacesList({spaces, workspaceStatus}: Props) {
  if (workspaceStatus === "disconnected")
    return (
      <EmptySection
        icon={<FileFilled />}
        message="Unable to connect to service."
      />
    )
  if (workspaceStatus === "login-required")
    return (
      <EmptySection
        icon={<FileFilled />}
        message="Login required to view spaces."
      />
    )
  if (spaces.length === 0)
    return (
      <EmptySection
        icon={<FileFilled />}
        message="You have no spaces yet. Create a space by importing data."
      />
    )

  return (
    <menu className="saved-spaces-list">
      {spaces
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((space) => {
          return <SpaceListItem key={space.id} space={space} />
        })}
    </menu>
  )
}
