import ColumnsModal from "app/columns/columns-modal"
import HookLog from "app/system-test/hook-log"
import React from "react"
import AboutModal from "src/js/components/about-modal"
import BrimToaster from "src/js/components/brim-toaster"
import BrimTooltip from "src/js/components/brim-tooltip"
import ErrorNotice from "src/js/components/error-notice"
import HTMLContextMenu from "src/js/components/html-context-menu"
import {XLatestError} from "src/js/components/latest-error"
import {LeftPane} from "src/js/components/LeftPane"
import {Modals} from "src/js/components/Modals"
import {PopNotice} from "src/js/components/pop-notice"
import Preferences from "src/js/components/Preferences/Preferences"
import {XRightPane} from "src/js/components/right-pane"
import SpaceModal from "src/js/components/space-modal"
import StatusBar from "src/js/components/status-bar"
import TabBar from "src/js/components/TabBar/tab-bar"
import styled from "styled-components"

const ColumnLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: column;
  position: relative;
`

const RowLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: row;
  position: relative;
  padding-top: 1px;
`

const SearchPageMain = styled.div`
  display: flex;
  height: 100%;
`

const SearchPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: fadein 300ms;
`

export default function AppWrapper({children}) {
  return (
    <div className="app-wrapper">
      <div className="title-bar-drag-area" />
      <XLatestError />
      <SearchPageWrapper>
        <SearchPageMain>
          <ColumnLayout>
            <div id="modal-dialog-root" />
            <TabBar />
            <RowLayout>
              <LeftPane />
              <ColumnLayout>{children}</ColumnLayout>
              <XRightPane />
            </RowLayout>
            <StatusBar />
          </ColumnLayout>
        </SearchPageMain>
      </SearchPageWrapper>

      {/* Global Modals */}
      <ErrorNotice />
      <Preferences />
      <Modals />
      <AboutModal />
      <SpaceModal />
      <ColumnsModal />
      <HTMLContextMenu />
      <BrimToaster />
      <PopNotice />
      <BrimTooltip />
      {process.env.BRIM_ITEST === "true" && <HookLog />}
    </div>
  )
}
