import {isEqual} from "lodash"
import {zng} from "zealot"

import {withCommas} from "../lib/fmt"
import brim from "./"

export const ONE_CHAR = 7.39
export const FIELD_PAD = 14
export const PATH_PAD = 12
const WHITE_SPACE = /\s+/
const COMMA = /,/
const STRING_TYPE = /^b?string$/
const DOUBLE_QUOTE = /"/g
const ESCAPED_DOUBLE_QUOTE = '\\"'
const BACK_SLASH = /\\/g
const ESCAPED_BACK_SLASH = "\\\\"

interface PrimitiveField {
  name: string
  data: zng.Primitive
}

export function createPrimitiveCell({name, data}: PrimitiveField) {
  const {type, value} = data

  return {
    name,
    type,
    value,
    serialize() {
      return {name, type, value}
    },
    queryableValue() {
      if (this.value === null) return "null"
      if (this.value === undefined) return "null"
      if (this.type === "bool") return this.value === "T" ? "true" : "false"
      let quote = [WHITE_SPACE, COMMA].some((reg) => reg.test(this.value))
      if (STRING_TYPE.test(this.type)) quote = true
      const str = this.value
        .replace(BACK_SLASH, ESCAPED_BACK_SLASH)
        .replace(DOUBLE_QUOTE, ESCAPED_DOUBLE_QUOTE)
      return quote ? `"${str}"` : str
    },
    stringValue(): string {
      if (value === null) return "null"
      else if (Array.isArray(value)) return value.join(",")
      else return value
    },

    toDate() {
      return new Date(+this.value * 1000)
    },

    display() {
      if (value === "(empty)") {
        return ""
      } else if (value === null) {
        return "⦻"
      } else if (type === "count") {
        return withCommas(value.toString())
      } else if (type === "time") {
        return brim.time(this.toDate()).format()
      } else if (isEqual(value, {})) {
        return ""
      } else if (value === undefined) {
        return ""
      } else {
        return value.toString()
      }
    },
    compound() {
      return false
    },
    guessWidth() {
      if (name === "_path") {
        return this.display().length * ONE_CHAR + FIELD_PAD + PATH_PAD
      } else {
        return Math.ceil(this.display().length * ONE_CHAR + FIELD_PAD)
      }
    }
  }
}
