import lib from "src/js/lib"
import {
  SerializedZedField,
  SerializedZedRecord,
  ZedField,
  ZedPrimitive,
  ZedRecord
} from "zealot/zed"
import brim from "../../../brim"
import {createCell} from "../../../brim/cell"
import {downloadPcap} from "../../../flows/downloadPcap"
import scrollToLog from "../../../flows/scrollToLog"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../../flows/searchBar/actions"
import {submitSearch} from "../../../flows/submitSearch/mod"
import {viewLogDetail} from "../../../flows/viewLogDetail"
import open from "../../../lib/open"
import ErrorFactory from "../../../models/ErrorFactory"
import virusTotal from "../../../services/virusTotal"
import Layout from "../../../state/Layout/actions"
import Modal from "../../../state/Modal"
import Notice from "../../../state/Notice"
import SearchBar from "../../../state/SearchBar"
import tab from "../../../state/Tab"
import action from "./action"

function buildSearchActions() {
  return {
    copy: action({
      name: "search-cell-menu-copy",
      label: "Copy",
      listener(_dispatch, data: SerializedZedField) {
        const f = ZedField.deserialize(data)
        lib.doc.copyToClipboard(f.data.toString())
      }
    }),
    countBy: action({
      name: "search-cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, data: SerializedZedField) {
        const f = ZedField.deserialize(data)
        dispatch(appendQueryCountBy(f))
        dispatch(submitSearch())
      }
    }),
    detail: action({
      name: "search-cell-menu-detail",
      label: "Open details",
      listener(dispatch, data: SerializedZedRecord) {
        const record = ZedRecord.deserialize(data)
        dispatch(Layout.showRightSidebar())
        dispatch(viewLogDetail(record))
      }
    }),
    exclude: action({
      name: "search-cell-menu-exclude",
      label: "Filter != value",
      listener(dispatch, data: SerializedZedField) {
        dispatch(appendQueryExclude(ZedField.deserialize(data)))
        dispatch(submitSearch())
      }
    }),
    freshInclude: action({
      name: "search-cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, data: SerializedZedField) {
        const cell = createCell(ZedField.deserialize(data))
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(cell.queryableValue()))
        dispatch(submitSearch())
      }
    }),
    fromTime: action({
      name: "search-cell-menu-from-time",
      label: 'Use as "start" time',
      listener(dispatch, data: SerializedZedField) {
        const field = ZedField.deserialize(data)
        if (field.data instanceof ZedPrimitive && field.data.type === "time") {
          dispatch(tab.setFrom(brim.time(field.data.toDate()).toTs()))
          dispatch(submitSearch())
        }
      }
    }),
    groupByDrillDown: action({
      name: "search-cell-menu-pivot-to-logs",
      label: "Pivot to logs",
      listener(dispatch, program: string, data: SerializedZedRecord) {
        const record = ZedRecord.deserialize(data)
        const newProgram = brim
          .program(program)
          .drillDown(record)
          .string()

        if (newProgram) {
          dispatch(SearchBar.clearSearchBar())
          dispatch(SearchBar.changeSearchBarInput(newProgram))
          dispatch(submitSearch())
        }
      }
    }),
    include: action({
      name: "search-cell-menu-include",
      label: "Filter = value",
      listener(dispatch, data: SerializedZedField) {
        dispatch(appendQueryInclude(ZedField.deserialize(data)))
        dispatch(submitSearch())
      }
    }),
    in: action({
      name: "search-cell-menu-in",
      label: "Filter in field",
      listener(dispatch, data: SerializedZedField) {
        dispatch(appendQueryIn(createCell(ZedField.deserialize(data))))
        dispatch(submitSearch())
      }
    }),
    jumpToTime: action({
      name: "search-cell-menu-show-context",
      label: "View in full context",
      listener(
        dispatch,
        fieldData: SerializedZedField,
        recordData: SerializedZedRecord
      ) {
        const field = ZedField.deserialize(fieldData)
        const record = ZedRecord.deserialize(recordData)
        if (field.data instanceof ZedPrimitive && field.data.type === "time") {
          const brimTime = brim.time(field.data.toDate())
          dispatch(tab.setFrom(brimTime.subtract(1, "minutes").toTs()))
          dispatch(tab.setTo(brimTime.add(1, "minutes").toTs()))
          dispatch(SearchBar.clearSearchBar())
          dispatch(submitSearch())
            .then(() => {
              dispatch(scrollToLog(record))
            })
            .catch((error) => {
              console.error(error)
              dispatch(Notice.set(ErrorFactory.create(error)))
            })
        }
      }
    }),
    notIn: action({
      name: "search-cell-menu-not-in",
      label: "Filter not in field",
      listener(dispatch, data: SerializedZedField) {
        dispatch(appendQueryNotIn(createCell(ZedField.deserialize(data))))
        dispatch(submitSearch())
      }
    }),
    logResult: action({
      name: "search-cell-menu-log-result",
      label: "Log result to console",
      listener(_dispatch, field: SerializedZedField, log: SerializedZedRecord) {
        console.log(JSON.stringify(log))
        console.log(JSON.stringify(field))
      }
    }),
    pcaps: action({
      name: "search-cell-menu-pcaps",
      label: "Download PCAPS",
      listener(dispatch, data: SerializedZedRecord) {
        dispatch(downloadPcap(ZedRecord.deserialize(data)))
      }
    }),
    sortAsc: action({
      name: "search-cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, data: SerializedZedField) {
        const field = ZedField.deserialize(data)
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(submitSearch())
      }
    }),
    sortDesc: action({
      name: "search-cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, data: SerializedZedField) {
        const field = ZedField.deserialize(data)
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(submitSearch())
      }
    }),
    toTime: action({
      name: "search-cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, data: SerializedZedField) {
        const field = ZedField.deserialize(data)
        if (field.data instanceof ZedPrimitive && field.data.type === "time") {
          dispatch(
            tab.setTo(
              brim
                .time((field.data as ZedPrimitive).toDate())
                .add(1, "ms")
                .toTs()
            )
          )
          dispatch(submitSearch())
        }
      }
    }),
    virusTotalRightclick: action({
      name: "search-cell-menu-virus-total",
      label: "VirusTotal Lookup",
      listener(dispatch, data: SerializedZedField) {
        const field = ZedField.deserialize(data)
        if (field.data instanceof ZedPrimitive && !field.data.isUnset()) {
          open(virusTotal.url(field.data.toString() as string))
        }
      }
    }),
    whoisRightclick: action({
      name: "search-cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, data: SerializedZedField) {
        const field = ZedField.deserialize(data)
        dispatch(Modal.show("whois", {addr: field.data.toString()}))
      }
    })
  }
}

export default buildSearchActions()
