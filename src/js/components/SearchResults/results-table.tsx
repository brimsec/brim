import nextPageViewerSearch from "app/search/flows/next-page-viewer-search"
import {isEmpty} from "lodash"
import searchFieldContextMenu from "ppl/menus/search-field-context-menu"
import React, {useEffect} from "react"
import {connect, useDispatch} from "react-redux"
import {zng} from "zealot"
import {openLogDetailsWindow} from "../../flows/open-log-details-window"
import {viewLogDetail} from "../../flows/view-log-detail"
import dispatchToProps from "../../lib/dispatch-to-props"
import TableColumns from "../../models/table-columns"
import Columns from "../../state/Columns"
import Current from "../../state/Current"
import Layout from "../../state/Layout"
import {ColumnHeadersViewState} from "../../state/Layout/types"
import Prefs from "../../state/Prefs"
import SearchBar from "../../state/SearchBar"
import {Space} from "../../state/Spaces/types"
import {DispatchProps, State} from "../../state/types"
import View from "../../state/View"
import Viewer from "../../state/Viewer"
import {ScrollPosition, ViewerDimens} from "../../types"
import LogRow from "../log-row"
import buildViewerDimens from "../Viewer/build-viewer-dimens"
import Chunker from "../Viewer/Chunker"
import {endMessage} from "../Viewer/Styler"
import ViewerComponent from "../Viewer/Viewer"
import getEndMessage from "./get-end-message"
import NoResults from "./no-results"
import {useRowSelection} from "./selection"

type StateProps = {
  logs: zng.Record[]
  timeZone: string
  timeFormat: string
  isIncomplete: boolean
  isFetching: boolean
  tableColumns: TableColumns
  columnHeadersView: ColumnHeadersViewState
  program: string
  space: Space
  scrollPos: ScrollPosition
}

type OwnProps = {
  height: number
  width: number
  multiSelect: boolean
}

type Props = StateProps & DispatchProps & OwnProps

export default function ResultsTable(props: Props) {
  const dispatch = useDispatch()
  const {parentRef, selection, clicked} = useRowSelection({
    multi: props.multiSelect
  })
  const {logs, columnHeadersView} = props

  let type
  if (columnHeadersView === "AUTO") {
    type = props.tableColumns.showHeader() ? "fixed" : "auto"
  } else {
    type = columnHeadersView === "ON" ? "fixed" : "auto"
  }

  const dimens = buildViewerDimens({
    type,
    height: props.height,
    width: props.width,
    size: logs.length,
    rowHeight: 25,
    sumColumnWidths: props.tableColumns.sumWidths()
  })

  const chunker = new Chunker({
    size: logs.length,
    height: props.height,
    rowHeight: 25,
    chunkSize: 5,
    overScan: 1
  })

  useEffect(() => {
    if (selection.isEmpty()) return
    dispatch(viewLogDetail(logs[selection.currentRange[0]]))
  }, [selection])

  function renderRow(index: number, dimens: ViewerDimens) {
    return (
      <LogRow
        columns={props.tableColumns}
        key={index}
        index={index}
        log={logs[index]}
        timeZone={props.timeZone}
        timeFormat={props.timeFormat}
        highlight={selection.includes(index)}
        dimens={dimens}
        onClick={(e) => clicked(e, index)}
        onDoubleClick={() => {
          dispatch(viewLogDetail(logs[index]))
          dispatch(openLogDetailsWindow())
        }}
        rightClick={searchFieldContextMenu(
          props.program,
          props.tableColumns.getColumns().map((c) => c.name),
          props.space
        )}
      />
    )
  }

  function onLastChunk() {
    if (props.isIncomplete && !props.isFetching) {
      props.dispatch(nextPageViewerSearch())
    }
  }

  function renderEnd() {
    if (props.isIncomplete || props.isFetching) return null
    else
      return (
        <p className="end-message" style={endMessage(dimens)}>
          {getEndMessage(props.program, logs.length)}
        </p>
      )
  }

  if (isEmpty(logs) && props.isFetching) return null
  if (isEmpty(logs)) return <NoResults width={props.width} />

  return (
    <ViewerComponent
      innerRef={parentRef}
      logs={logs}
      renderRow={renderRow}
      chunker={chunker}
      dimens={dimens}
      tableColumns={props.tableColumns}
      timeZone={props.timeZone}
      timeFormat={props.timeFormat}
      onLastChunk={onLastChunk}
      renderEnd={renderEnd}
      scrollPos={props.scrollPos}
    />
  )
}

function stateToProps(state: State): StateProps {
  return {
    isFetching: Viewer.getStatus(state) === "FETCHING",
    isIncomplete: Viewer.getEndStatus(state) === "INCOMPLETE",
    tableColumns: Columns.getCurrentTableColumns(state),
    columnHeadersView: Layout.getColumnHeadersView(state),
    timeZone: View.getTimeZone(state),
    timeFormat: Prefs.getTimeFormat(state),
    logs: Viewer.getLogs(state),
    program: SearchBar.getSearchProgram(state),
    space: Current.getSpace(state),
    scrollPos: Viewer.getScrollPos(state)
  }
}

export const XResultsTable = connect<StateProps, DispatchProps, OwnProps>(
  stateToProps,
  dispatchToProps
)(ResultsTable)
