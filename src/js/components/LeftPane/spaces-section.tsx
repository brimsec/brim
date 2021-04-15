import {useSelector} from "react-redux"
import Current from "../../state/Current"
import get from "lodash/get"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import Spaces from "../../state/Spaces"
import AddSpaceButton from "../add-space-button"
import SavedSpacesList from "../saved-spaces-list"
import React from "react"
import {
  ClickRegion,
  DragAnchor,
  SectionContents,
  SectionHeader,
  StyledArrow,
  StyledSection,
  Title
} from "./common"

function SpacesSection({isOpen, style, resizeProps, toggleProps}) {
  const workspace = useSelector(Current.getWorkspace)
  const id = get(workspace, ["id"], "")
  const wsStatus = useSelector(WorkspaceStatuses.get(id))
  const spaces = useSelector(Spaces.getSpaces(id))

  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>Spaces</Title>
        </ClickRegion>
        <AddSpaceButton />
      </SectionHeader>
      <SectionContents>
        <SavedSpacesList spaces={spaces} workspaceStatus={wsStatus} />
      </SectionContents>
    </StyledSection>
  )
}

export default SpacesSection
