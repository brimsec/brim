import {ZealotPayload} from "../types"
import * as zjson from "../zjson"

function fail(t: any): never {
  throw new Error("Unknown zjson Type: " + JSON.stringify(t))
}

function getZeekPrimitive(type: zjson.Primitive): zjson.Primitive {
  switch (type) {
    case "byte":
    case "int16":
    case "int32":
    case "int64":
    case "uint16":
    case "uint32":
      return "int"
    case "uint64":
      return "count"
    case "float64":
      return "double"
    case "ip":
      return "addr"
    case "net":
      return "subnet"
    case "duration":
      return "interval"
    case "bstring":
      return "string"
    case "zenum":
      return "enum"
    default:
      return type
  }
}

function replaceColumn(c: zjson.Column): zjson.Column {
  if (c.type == "array" || c.type == "set") {
    return {...c, of: replaceTypes(c.of)}
  } else if (c.type == "union") {
    return {...c, of: c.of.map(replaceTypes)}
  } else if (c.type == "record") {
    return {...c, of: c.of.map(replaceColumn)}
  } else {
    return {...c, type: getZeekPrimitive(c.type)}
  }
}

export function replaceTypes(t: zjson.Type): zjson.Type {
  if (typeof t == "string") {
    return getZeekPrimitive(t)
  } else if (t.type == "array" || t.type == "set") {
    return {...t, of: t.of = replaceTypes(t.of)}
  } else if (t.type == "union") {
    return {...t, of: t.of.map(replaceTypes)}
  } else if (t.type == "record") {
    return {...t, of: t.of.map(replaceColumn)}
  }
  fail(t)
}

function replaceSchema(r: zjson.Item) {
  if (r.schema) r.schema.of = r.schema.of.map(replaceColumn)
  return r
}

export function zngToZeek() {
  return (p: ZealotPayload) => {
    if (p.type == "SearchRecords") {
      return {...p, records: p.records.map(replaceSchema)}
    } else {
      return p
    }
  }
}
