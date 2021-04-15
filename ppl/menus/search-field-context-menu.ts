import {isEqual} from "lodash"

import {RightClickBuilder} from "src/js/types"
import {MenuItemConstructorOptions} from "electron"
import {zng} from "zealot"
import menu from "src/js/electron/menu"
import {hasGroupByProc} from "src/js/lib/Program"
import {Space} from "src/js/state/Spaces/types"

export default function searchFieldContextMenu(
  program: string,
  columns: string[],
  space: Space
): RightClickBuilder {
  return function(
    field: zng.Field,
    log: zng.Record,
    compound: boolean
  ): MenuItemConstructorOptions[] {
    const isTime = field.data.getType() === "time"
    const isConn = log.try("_path")?.toString() === "conn"
    const isGroupBy = hasGroupByProc(program)
    const isIp = ["addr", "set[addr]"].includes(field.data.getType())
    const hasCol = columns.includes(field.name)
    const flatColNames = log.flatten().getColumnNames()
    const sameCols = isEqual(flatColNames.sort(), columns.sort())
    const hasPackets = space && space.pcap_support
    const virusTotal = [
      "hassh",
      "host",
      "ja3",
      "ja3s",
      "md5",
      "sha1",
      "sha256",
      "server_name",
      "query"
    ].includes(field.name)

    const searchMenuActions = menu.actions.search

    const fieldData = field.serialize()
    const recordData = log.serialize()

    return [
      searchMenuActions.include.menuItem([fieldData], {
        enabled: hasCol,
        visible: !compound
      }),
      searchMenuActions.exclude.menuItem([fieldData], {
        enabled: hasCol,
        visible: !compound
      }),
      searchMenuActions.in.menuItem([fieldData], {
        visible: !!compound
      }),
      searchMenuActions.notIn.menuItem([fieldData], {
        visible: !!compound
      }),
      searchMenuActions.freshInclude.menuItem([fieldData], {enabled: true}),
      menu.separator(),
      searchMenuActions.groupByDrillDown.menuItem([program, recordData], {
        enabled: isGroupBy && sameCols
      }),
      searchMenuActions.countBy.menuItem([fieldData], {enabled: !isGroupBy}),
      menu.separator(),
      searchMenuActions.copy.menuItem([fieldData]),
      menu.separator(),
      searchMenuActions.sortAsc.menuItem([fieldData], {enabled: hasCol}),
      searchMenuActions.sortDesc.menuItem([fieldData], {enabled: hasCol}),
      menu.separator(),
      searchMenuActions.fromTime.menuItem([fieldData], {enabled: isTime}),
      searchMenuActions.toTime.menuItem([fieldData], {enabled: isTime}),
      searchMenuActions.jumpToTime.menuItem([fieldData, recordData], {
        enabled: isTime
      }),
      menu.separator(),
      searchMenuActions.pcaps.menuItem([recordData], {
        enabled: isConn && hasPackets
      }),
      searchMenuActions.detail.menuItem([recordData], {enabled: true}),
      menu.separator(),
      searchMenuActions.whoisRightclick.menuItem([fieldData], {enabled: isIp}),
      searchMenuActions.virusTotalRightclick.menuItem([fieldData], {
        enabled: virusTotal || isIp
      }),
      menu.separator(),
      searchMenuActions.logResult.menuItem([fieldData, recordData], {
        enabled: true
      })
    ]
  }
}
