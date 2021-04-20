import isString from "lodash/isString"
import {ZedPrimitive} from "zealot/zed"

export function toZql(object: unknown): string {
  if (object instanceof ZedPrimitive) return toZqlZngPrimitive(object)
  if (isString(object)) return toZqlString(object)
  if (object instanceof Date) return toZqlDate(object)
  if (typeof object === "boolean") return toZqlBool(object)

  throw new Error(`Can't convert object to ZQL: ${object}`)
}

const DOUBLE_QUOTE = /"/g
const ESCAPED_DOUBLE_QUOTE = '\\"'
const BACK_SLASH = /\\/g
const ESCAPED_BACK_SLASH = "\\\\"

function toZqlString(string: string) {
  return `"${string
    .replace(BACK_SLASH, ESCAPED_BACK_SLASH)
    .replace(DOUBLE_QUOTE, ESCAPED_DOUBLE_QUOTE)}"`
}

function toZqlDate(date: Date) {
  return (date.getTime() / 1000).toString()
}

function toZqlBool(bool: boolean) {
  return bool ? "true" : "false"
}

function toZqlZngPrimitive(data: ZedPrimitive) {
  if (data.type === "string" || data.type === "bstring")
    return toZqlString(data.toString())
  throw new Error(`Can't convert Zng Type: ${data.type} to zql`)
}
