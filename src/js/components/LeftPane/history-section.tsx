import {useDispatch, useSelector} from "react-redux"
import Layout from "../../state/Layout"
import React from "react"
import InvestigationLinear from "../Investigation/investigation-linear"
import FilterTree from "../filter-tree"
import {
  ClickRegion,
  DragAnchor,
  SectionContents,
  SectionHeader,
  StyledArrow,
  StyledSection,
  StyledViewSelect,
  Title
} from "./common"
import usePopupMenu from "../hooks/use-popup-menu"
import {capitalize} from "lodash"
import DropdownArrow from "../../icons/dropdown-arrow"

function InvestigationView({view}) {
  switch (view) {
    case "tree":
      return <InvestigationTree />
    case "linear":
      return <InvestigationLinear />
    default:
      return null
  }
}

function InvestigationTree() {
  return <FilterTree />
}

const ViewSelect = () => {
  const dispatch = useDispatch()
  const currentView = useSelector(Layout.getInvestigationView)

  const menu = usePopupMenu([
    {
      label: "Linear",
      click: () => dispatch(Layout.setInvestigationView("linear"))
    },
    {
      label: "Tree",
      click: () => dispatch(Layout.setInvestigationView("tree"))
    }
  ])

  return (
    <StyledViewSelect onClick={menu.onClick}>
      {capitalize(currentView)}
      <DropdownArrow />
    </StyledViewSelect>
  )
}

function HistorySection({isOpen, style, resizeProps, toggleProps}) {
  const view = useSelector(Layout.getInvestigationView)
  return (
    <StyledSection style={style}>
      <DragAnchor {...resizeProps} />
      <SectionHeader>
        <ClickRegion {...toggleProps}>
          <StyledArrow show={isOpen} />
          <Title>History</Title>
        </ClickRegion>
        <ViewSelect />
      </SectionHeader>
      <SectionContents>
        <InvestigationView view={view} />
      </SectionContents>
    </StyledSection>
  )
}

export default HistorySection
