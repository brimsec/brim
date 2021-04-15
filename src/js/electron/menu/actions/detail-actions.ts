import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../../flows/searchBar/actions"
import lib from "../../../lib"
import open from "../../../lib/open"
import {viewLogDetail} from "../../../flows/view-log-detail"
import Modal from "../../../state/Modal"
import SearchBar from "../../../state/SearchBar"
import action from "./action"
import brim from "../../../brim"
import tab from "../../../state/Tab"
import virusTotal from "../../../services/virus-total"
import {downloadPcap} from "../../../flows/download-pcap"
import {openNewSearchTab} from "../../../flows/open-new-search-window"
import {zng} from "zealot"
import {createCell} from "../../../brim/cell"

function buildDetailActions() {
  return {
    copy: action({
      name: "detail-cell-menu-copy",
      label: "Copy",
      listener(_dispatch, data: zng.SerializedField) {
        const f = zng.Field.deserialize(data)
        lib.doc.copyToClipboard(f.data.toString())
      }
    }),
    countBy: action({
      name: "detail-cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, data: zng.SerializedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryCountBy(zng.Field.deserialize(data)))
        dispatch(openNewSearchTab())
      }
    }),
    detail: action({
      name: "detail-cell-menu-detail",
      label: "View details",
      listener(dispatch, log: zng.SerializedRecord) {
        dispatch(viewLogDetail(zng.Record.deserialize(log)))
      }
    }),
    exclude: action({
      name: "detail-cell-menu-exclude",
      label: "Filter != value in new search",
      listener(dispatch, field: zng.SerializedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryExclude(zng.Field.deserialize(field)))
        dispatch(openNewSearchTab())
      }
    }),
    freshInclude: action({
      name: "detail-cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, field: zng.SerializedField) {
        const cell = createCell(zng.Field.deserialize(field))
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(cell.queryableValue()))
        dispatch(openNewSearchTab())
      }
    }),
    fromTime: action({
      name: "detail-cell-menu-from-time",
      label: 'Use as "start" time in new search',
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        if (field.data.type === "time") {
          dispatch(SearchBar.clearSearchBar())
          dispatch(
            tab.setFrom(
              brim.time((field.data as zng.Primitive).toDate()).toTs()
            )
          )
          dispatch(openNewSearchTab())
        }
      }
    }),
    groupByDrillDown: action({
      name: "detail-cell-menu-pivot-to-logs",
      label: "Pivot to logs",
      listener(dispatch, program, log: zng.SerializedRecord) {
        const newProgram = brim
          .program(program)
          .drillDown(zng.Record.deserialize(log))
          .string()

        if (newProgram) {
          dispatch(SearchBar.clearSearchBar())
          dispatch(SearchBar.changeSearchBarInput(newProgram))
          dispatch(openNewSearchTab())
        }
      }
    }),
    include: action({
      name: "detail-cell-menu-include",
      label: "Filter = value in new search",
      listener(dispatch, field: zng.SerializedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryInclude(zng.Field.deserialize(field)))
        dispatch(openNewSearchTab())
      }
    }),
    in: action({
      name: "detail-cell-menu-in",
      label: "Filter in field in new search",
      listener(dispatch, field: zng.SerializedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryIn(createCell(zng.Field.deserialize(field))))
        dispatch(openNewSearchTab())
      }
    }),
    notIn: action({
      name: "detail-cell-menu-not-in",
      label: "Filter not in field in new search",
      listener(dispatch, field: zng.SerializedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryNotIn(createCell(zng.Field.deserialize(field))))
        dispatch(openNewSearchTab())
      }
    }),
    logResult: action({
      name: "detail-cell-menu-log-result",
      label: "Log result to console",
      listener(_dispatch, field, log) {
        console.log(JSON.stringify(log))
        console.log(JSON.stringify(field))
      }
    }),
    pcaps: action({
      name: "detail-cell-menu-pcaps",
      label: "Download PCAPS",
      listener(dispatch, log: zng.SerializedRecord) {
        dispatch(downloadPcap(zng.Record.deserialize(log)))
      }
    }),
    sortAsc: action({
      name: "detail-cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, field: zng.SerializedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(openNewSearchTab())
      }
    }),
    sortDesc: action({
      name: "detail-cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, field: zng.SerializedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(openNewSearchTab())
      }
    }),
    toTime: action({
      name: "detail-cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        if (field.data.type === "time") {
          dispatch(SearchBar.clearSearchBar())
          dispatch(
            tab.setTo(
              brim
                .time((field.data as zng.Primitive).toDate())
                .add(1, "ms")
                .toTs()
            )
          )
          dispatch(openNewSearchTab())
        }
      }
    }),
    virusTotalRightclick: action({
      name: "detail-cell-menu-virus-total",
      label: "VirusTotal Lookup",
      listener(_dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        open(virusTotal.url(field.data.toString()))
      }
    }),
    whoisRightclick: action({
      name: "detail-cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, data: zng.SerializedField) {
        const field = zng.Field.deserialize(data)
        dispatch(Modal.show("whois", {addr: field.data.value}))
      }
    })
  }
}

export default buildDetailActions()
