import {useDispatch, useSelector} from "react-redux"
import React, {MouseEvent} from "react"
import styled from "styled-components"

import {XLeftPaneExpander} from "./left-pane-expander"
import WorkspacePicker from "../workspace-picker"
import Current from "../../state/Current"
import Layout from "../../state/Layout"
import Pane from "./../Pane"
import get from "lodash/get"
import {Sectional} from "../../../pkg/sectional"
import HistorySection from "./history-section"
import SpacesSection from "./spaces-section"
import QueriesSection from "./queries-section"

const EmptyText = styled.div`
  ${(p) => p.theme.typography.labelNormal}
  color: var(--slate);
  margin-top: 110px;
  padding: 0 24px;
  text-align: center;
`

export function LeftPane() {
  const dispatch = useDispatch()
  const isOpen = useSelector(Layout.getLeftSidebarIsOpen)
  const width = useSelector(Layout.getLeftSidebarWidth)
  const sections = useSelector(Layout.getSidebarSections).map((s) => ({
    ...s,
    min: 100,
    closedSize: 24
  }))

  const ws = useSelector(Current.getWorkspace)
  const id = get(ws, ["id"], "")
  const setSections = (sections) =>
    dispatch(Layout.setSidebarSections(sections))

  function onDragPane(e: MouseEvent) {
    const width = e.clientX
    const max = window.innerWidth
    dispatch(Layout.setLeftSidebarWidth(Math.min(width, max)))
  }

  if (!isOpen) return <XLeftPaneExpander />

  return (
    <Pane
      isOpen={isOpen}
      position="left"
      width={width}
      onDrag={onDragPane}
      className="history-pane"
    >
      {!id ? (
        <EmptyText>
          The workspace previously on this tab has been removed.
        </EmptyText>
      ) : (
        <>
          <WorkspacePicker />
          <Sectional sections={sections} onChange={setSections}>
            {(data, provided) => {
              if (data.id === "spaces")
                return (
                  <SpacesSection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              if (data.id === "queries")
                return (
                  <QueriesSection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              if (data.id === "history")
                return (
                  <HistorySection
                    isOpen={data.isOpen}
                    key={data.id}
                    {...provided}
                  />
                )
              return null
            }}
          </Sectional>
        </>
      )}
    </Pane>
  )
}
