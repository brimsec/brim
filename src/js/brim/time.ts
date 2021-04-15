import moment from "moment-timezone"
import bigInt from "big-integer"

import {DateTuple} from "../lib/time-window"
import {TimeUnit} from "../lib"
import {isDate} from "../lib/is"
import brim, {Ts, Span} from "./"

function time(val: Ts | Date = new Date()) {
  const ts = isDate(val) ? dateToTs(val) : val

  return {
    toDate(): Date {
      return new Date((ts.sec + ts.ns / 1e9) * 1e3)
    },

    toFracSec() {
      return ts.sec + ts.ns / 1e9
    },

    toTs(): Ts {
      return ts
    },

    toBigInt(): bigInt.BigInteger {
      return bigInt(ts.sec)
        .times(1e9)
        .plus(ts.ns)
    },

    add(amount: number, unit: TimeUnit) {
      const ts = dateToTs(
        moment(this.toDate())
          .add(amount, unit)
          .toDate()
      )
      return brim.time(ts)
    },

    subtract(amount: number, unit: TimeUnit) {
      const ts = dateToTs(
        moment(this.toDate())
          .subtract(amount, unit)
          .toDate()
      )
      return brim.time(ts)
    },

    addTs(dur: Ts) {
      const added = this.toBigInt().add(time(dur).toBigInt())
      return brim.time(fromBigInt(added))
    },

    subTs(diff: Ts) {
      const dur = this.toBigInt().minus(time(diff).toBigInt())
      return brim.time(fromBigInt(dur))
    },

    format(fmt?: string) {
      return moment(this.toDate()).format(fmt)
    }
  }
}

function fromBigInt(i: bigInt.BigInteger): Ts {
  const sec = i.over(1e9)
  const ns = i.minus(sec.times(1e9))
  return {sec: sec.toJSNumber(), ns: ns.toJSNumber()}
}

function dateToTs(date: Date): Ts {
  const ms = date.getTime()
  const secFloat = ms / 1000
  const sec = Math.floor(secFloat)
  const ns = +(secFloat - sec).toFixed(3) * 1e9
  return {
    sec,
    ns
  }
}

time.setZone = function(name: string) {
  moment.tz.setDefault(name)
}

time.getZoneNames = function() {
  return moment.tz.names()
}

time.setDefaultFormat = function(format = "") {
  if (format) {
    moment.defaultFormat = format
    moment.defaultFormatUtc = format
  } else {
    moment.defaultFormat = "YYYY-MM-DDTHH:mm:ss.SSS"
    moment.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss.SSS"
  }
}

// Remove or move this later
time.convertToSpan = function(tw: DateTuple | null | undefined): Span | null {
  if (tw) {
    const [from, to] = tw
    return [brim.time(from).toTs(), brim.time(to).toTs()]
  } else {
    return null
  }
}

export default time
