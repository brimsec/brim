import {useDispatch} from "react-redux"
import React from "react"
import classNames from "classnames"
import styled from "styled-components"

import {Finding} from "../../state/Investigation/types"
import {submitSearch} from "../../flows/submitSearch/mod"
import FindingProgram from "./finding-program"
import Investigation from "../../state/Investigation"
import MagnifyingGlass from "../../icons/magnifying-glass"
import Search from "../../state/Search"
import usePopupMenu from "../hooks/use-popup-menu"
import {remote} from "electron"

const StyledMagnifyingGlass = styled(MagnifyingGlass)`
    fill: var(--lead);
    min-width: 13px;
    width: 13px;
    min-height: 13px;
    height: 13px;
  }
`

type Props = {finding: Finding; workspaceId: string; spaceId: string}

export default React.memo<Props>(function FindingCard({
  finding,
  workspaceId,
  spaceId
}: Props) {
  const dispatch = useDispatch()

  function onClick() {
    dispatch(Search.restore(finding.search))
    dispatch(submitSearch({history: true, investigation: false}))
  }

  const menu = usePopupMenu([
    {
      label: "Delete",
      click: () =>
        dispatch(
          Investigation.deleteFindingByTs(workspaceId, spaceId, finding.ts)
        )
    },
    {type: "separator"},
    {
      label: "Delete All",
      click: () =>
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete All History",
            message: `Are you sure you want to delete all history entries for this space?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0)
              dispatch(
                Investigation.clearSpaceInvestigation(workspaceId, spaceId)
              )
          })
    }
  ])

  return (
    <div
      className={classNames("finding-card-wrapper")}
      onClick={onClick}
      onContextMenu={() => menu.open()}
    >
      <div className="finding-card">
        <StyledMagnifyingGlass />
        <FindingProgram search={finding.search} />
      </div>
    </div>
  )
})
