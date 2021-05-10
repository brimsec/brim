import * as chrono from "chrono-node"
import moment from "moment-timezone"

import brim from "../brim"

function date(d: Date, zone = "UTC") {
  return {
    zone(name: string) {
      zone = name
      return this
    },

    format(fmt: string) {
      return moment(d)
        .tz(zone)
        .format(fmt)
    }
  }
}

// Move this, add tests, refactor
date.parseInZone = (string, zone, ref?) => {
  const pad = (n) => (n < 10 ? `0${n}` : n)

  const tmp = chrono.strict.parseDate(string, ref)
  if (tmp) {
    const year = tmp.getFullYear()
    const month = pad(tmp.getMonth() + 1)
    const date = pad(tmp.getDate())
    const hour = pad(tmp.getHours())
    const mins = pad(tmp.getMinutes())
    const secs = pad(tmp.getSeconds())
    const ms = (tmp.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
    const offset = moment(tmp)
      .tz(zone)
      .format("Z")

    const str = [year, month, date, hour, mins, secs, ms, offset].join(" ")
    const fmt = "YYYY MM DD HH mm ss SSS Z"

    return brim.time(moment(str, fmt, true).toDate()).toTs()
  } else if (brim.relTime(string).isValid()) {
    return string
  } else {
    if (/^\s*now.*/i.test(string)) return null
    const d = chrono.casual.parseDate(string, ref)
    if (d) {
      return brim.time(d).toTs()
    } else {
      return null
    }
  }
}

date.zoneNames = function() {
  return moment.tz.names()
}

export default date
