import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../../flows/searchBar/actions"
import {downloadPcap} from "../../../flows/download-pcap"
import {submitSearch} from "../../../flows/submitSearch/mod"
import {viewLogDetail} from "../../../flows/view-log-detail"
import ErrorFactory from "../../../models/error-factory"
import Layout from "../../../state/Layout/actions"
import Modal from "../../../state/Modal"
import Notice from "../../../state/Notice"
import SearchBar from "../../../state/SearchBar"
import action from "./action"
import brim from "../../../brim"
import open from "../../../lib/open"
import scrollToLog from "../../../flows/scroll-to-log"
import tab from "../../../state/Tab"
import virusTotal from "../../../services/virus-total"
import {zng} from "zealot"
import {createCell} from "../../../brim/cell"
import lib from "src/js/lib"

function buildSearchActions() {
  return {
    copy: action({
      name: "search-cell-menu-copy",
      label: "Copy",
      listener(_dispatch, data: zng.SerializedField) {
        const f = zng.Field.deserialize(data)
        lib.doc.copyToClipboard(f.data.toString())
      }
    }),
    countBy: action({
      name: "search-cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, data: zng.SerializedField) {
        const f = zng.Field.deserialize(data)
        dispatch(appendQueryCountBy(f))
        dispatch(submitSearch())
      }
    }),
    detail: action({
      name: "search-cell-menu-detail",
      label: "Open details",
      listener(dispatch, data: zng.SerializedRecord) {
        const record = zng.Record.deserialize(data)
        dispatch(Layout.showRightSidebar())
        dispatch(viewLogDetail(record))
      }
    }),
    exclude: action({
      name: "search-cell-menu-exclude",
      label: "Filter != value",
      listener(dispatch, data: zng.SerializedField) {
        dispatch(appendQueryExclude(zng.Field.deserialize(data)))
        dispatch(submitSearch())
      }
    }),
    freshInclude: action({
      name: "search-cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, data: zng.SerializedField) {
        const cell = createCell(zng.Field.deserialize(data))
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(cell.queryableValue()))
        dispatch(submitSearch())
      }
    }),
    fromTime: action({
      name: "search-cell-menu-from-time",
      label: 'Use as "start" time',
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        if (field.data.getType() === "time") {
          dispatch(
            tab.setFrom(
              brim.time((field.data as zng.Primitive).toDate()).toTs()
            )
          )
          dispatch(submitSearch())
        }
      }
    }),
    groupByDrillDown: action({
      name: "search-cell-menu-pivot-to-logs",
      label: "Pivot to logs",
      listener(dispatch, program: string, data: zng.SerializedRecord) {
        const record = zng.Record.deserialize(data)
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
      listener(dispatch, data: zng.SerializedField) {
        dispatch(appendQueryInclude(zng.Field.deserialize(data)))
        dispatch(submitSearch())
      }
    }),
    in: action({
      name: "search-cell-menu-in",
      label: "Filter in field",
      listener(dispatch, data: zng.SerializedField) {
        dispatch(appendQueryIn(createCell(zng.Field.deserialize(data))))
        dispatch(submitSearch())
      }
    }),
    jumpToTime: action({
      name: "search-cell-menu-show-context",
      label: "View in full context",
      listener(
        dispatch,
        fieldData: zng.SerializedField,
        recordData: zng.SerializedRecord
      ) {
        const field = zng.Field.deserialize(fieldData)
        const record = zng.Record.deserialize(recordData)
        const brimTime = brim.time((field.data as zng.Primitive).toDate())
        if (field.data.type === "time") {
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
      listener(dispatch, data: zng.SerializedField) {
        dispatch(appendQueryNotIn(createCell(zng.Field.deserialize(data))))
        dispatch(submitSearch())
      }
    }),
    logResult: action({
      name: "search-cell-menu-log-result",
      label: "Log result to console",
      listener(
        _dispatch,
        field: zng.SerializedField,
        log: zng.SerializedRecord
      ) {
        console.log(JSON.stringify(log))
        console.log(JSON.stringify(field))
      }
    }),
    pcaps: action({
      name: "search-cell-menu-pcaps",
      label: "Download PCAPS",
      listener(dispatch, data: zng.SerializedRecord) {
        dispatch(downloadPcap(zng.Record.deserialize(data)))
      }
    }),
    sortAsc: action({
      name: "search-cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(submitSearch())
      }
    }),
    sortDesc: action({
      name: "search-cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(submitSearch())
      }
    }),
    toTime: action({
      name: "search-cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        if (field.data.type === "time") {
          dispatch(
            tab.setTo(
              brim
                .time((field.data as zng.Primitive).toDate())
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
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        if (field.data instanceof zng.Primitive && field.data.isSet()) {
          open(virusTotal.url(field.data.getValue() as string))
        }
      }
    }),
    whoisRightclick: action({
      name: "search-cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        dispatch(Modal.show("whois", {addr: field.data.value}))
      }
    })
  }
}

export default buildSearchActions()
