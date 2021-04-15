import {values} from "lodash"

import {$Column} from "./column"
import {ColumnSettingsMap} from "../types"

export function createColumnPrefs(p: ColumnSettingsMap = {}) {
  return {
    exists(key: string) {
      return !!p[key]
    },
    get(key: string) {
      return p[key]
    },
    getDefaultVisability() {
      const vals = values(p)
      if (vals.length == 0) return true
      if (vals.every((p) => p.isVisible)) return true
      return false
    },
    getDefaults(cols: $Column[]) {
      const isVisible = this.getDefaultVisability()
      const defaults = {}
      for (const c of cols) {
        if (!this.exists(c.key)) defaults[c.key] = {isVisible}
      }
      return defaults
    }
  }
}
