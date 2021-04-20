import {MenuItemConstructorOptions} from "electron"
import searchFieldContextMenu from "ppl/menus/searchFieldContextMenu"
import {createRecord} from "test/factories/record"
import fixtures from "../../test/fixtures"

const conn = createRecord({
  _path: "conn",
  id: {orig_h: "192.168.0.1"},
  ts: new Date(1234513 * 1000)
})

const dns = createRecord({query: "dns.query.yo"})

function menuText(menu: MenuItemConstructorOptions[]) {
  return menu
    .filter((item) => item.enabled)
    .map((item) => item.label)
    .join(", ")
}
const space = fixtures("space1")

describe("Log Right Click", () => {
  const program = "*"
  const columnNames = conn.columns

  test("conn log with pcap support", () => {
    const field = conn.getField("id.orig_h")
    const ctxMenu = searchFieldContextMenu(program, columnNames, space)(
      field,
      conn,
      false
    )

    expect(menuText(ctxMenu)).toMatch(/pcaps/i)
  })

  test("conn log without pcap support", () => {
    space.pcap_support = false

    const log = conn
    const field = log.getField("id.orig_h")
    const ctxMenu = searchFieldContextMenu(program, columnNames, space)(
      field,
      log,
      false
    )

    expect(menuText(ctxMenu)).not.toMatch(/pcaps/i)
  })

  test("dns log", () => {
    const log = dns
    const field = log.getField("query")
    const ctxMenu = searchFieldContextMenu(program, columnNames, space)(
      field,
      log,
      false
    )

    expect(menuText(ctxMenu)).toMatch(/virustotal/i)
    expect(menuText(ctxMenu)).toMatch(/count by/i)
  })

  test("time field for conn log", () => {
    const log = conn
    const field = log.getField("ts")
    const ctxMenu = searchFieldContextMenu(program, columnNames, space)(
      field,
      log,
      false
    )

    expect(menuText(ctxMenu)).toMatch(/"start" time/i)
    expect(menuText(ctxMenu)).toMatch(/"end" time/i)
  })
})

describe("Analysis Right Click", () => {
  const program = "* | count() by id.orig_h"
  const columnNames = ["count", "id.orig_h"]

  test("nested field", () => {
    const log = createRecord({
      count: 300,
      id: {orig_h: "192.168.0.51"}
    })
    const field = log.getField("id.orig_h")
    const ctxMenu = searchFieldContextMenu(program, columnNames, space)(
      field,
      log,
      false
    )

    expect(menuText(ctxMenu)).toMatch(/whois/i)
  })

  test("non-address field", () => {
    const log = createRecord({count: 100, proto: "tcp"})
    const field = log.getField("proto")
    const ctxMenu = searchFieldContextMenu(
      "* | count() by proto",
      ["count", "proto"],
      space
    )(field, log, false)

    expect(menuText(ctxMenu)).toMatch(/pivot/i)
  })
})
