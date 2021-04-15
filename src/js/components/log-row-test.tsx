import React from "react"

import {shallow} from "enzyme"

import {conn} from "../test/mock-logs"
import {createColumn} from "../state/Columns/models/column"
import LogRow from "./log-row"
import TableColumns from "../models/table-columns"

let props
beforeEach(() => {
  const log = conn()
  props = {
    columns: new TableColumns("1", log.type.map(createColumn), {
      "1": {isVisible: true}
    }),
    dimens: {
      rowHeight: 25,
      rowWidth: 300,
      viewHeight: 1000,
      viewWidth: 1000,
      listHeight: 20000,
      listWidth: 10000
    },
    highlight: false,
    index: 1,
    log: log,
    timeZone: "UTC",
    timeFormat: "",
    onClick: () => {},
    onDoubleClick: () => {},
    rightClick: () => []
  }
})

test("Rendering the row works", () => {
  shallow(<LogRow {...props} />)
})
