import * as zjson from "../zjson"
import {Type} from "./ts-types"
import {Record} from "./types/record"
import {Primitive} from "./types/primitive"
import {ZArray} from "./types/array"
import {Union} from "./types/union"
import {Set} from "./types/set"

export function constructType(t: zjson.Type, v: zjson.Value): Type {
  if (typeof t == "string") return new Primitive(t, v as string)
  if (t.type == "record") return new Record(t.of, v as zjson.Value[])
  if (t.type == "array") return new ZArray(t.of, v as zjson.Value[])
  if (t.type == "set") return new Set(t.of, v as zjson.Value[])
  if (t.type == "union") return new Union(t.of, v as zjson.Value[])
  throw new Error(`Unknown type: ${t}`)
}

export function createRecords(records: zjson.Items): Record[] {
  const schemas: {[id: string]: zjson.Schema} = {}

  return records.map((r) => {
    if (r.schema) {
      schemas[r.id] = r.schema
    }

    const schema = schemas[r.id]
    if (!schema) throw new Error("No Schema Present for ID: " + r.id)

    return new Record(schema.of, r.values)
  })
}
