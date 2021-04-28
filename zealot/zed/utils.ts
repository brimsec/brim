import {TypeAlias, Uint16, Uint32, Uint64, Uint8} from "."
import {ZedType} from "./types/types"
import {Int16} from "./values/int16"
import {Int32} from "./values/int32"
import {Int64} from "./values/int64"
import {Int8} from "./values/int8"
import {Time} from "./values/time"
import {ZedInt} from "./values/types"

export function typeId(type) {
  switch (type.kind) {
    case "primitive":
    case "alias":
      return type.name
    default:
      if (type.id === undefined) {
        throw new Error("Does not have an id")
      }
      return type.id.toString()
  }
}

export function isAlias(name) {
  // an alias is a non-integer string
  return isNaN(name as any)
}

export function isInt(value: unknown): value is ZedInt {
  return (
    value instanceof Int64 ||
    value instanceof Int32 ||
    value instanceof Int16 ||
    value instanceof Int8 ||
    value instanceof Uint64 ||
    value instanceof Uint32 ||
    value instanceof Uint16 ||
    value instanceof Uint8
  )
}

export function isTime(value: unknown): value is Time {
  return value instanceof Time
}

export function isTypeAlias(type: ZedType): type is TypeAlias {
  return type instanceof TypeAlias
}