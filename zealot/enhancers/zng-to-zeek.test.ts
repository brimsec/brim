import {replaceTypes} from "./zng-to-zeek"
import * as zjson from "../zjson"

function assertConversion(from: zjson.Type, to: zjson.Type) {
  expect(replaceTypes(from)).toEqual(to)
}

test("convert to int", () => {
  assertConversion(
    {
      type: "record",
      of: [
        {name: "one", type: "byte"},
        {name: "two", type: "int16"},
        {name: "three", type: "int32"},
        {name: "four", type: "int64"},
        {name: "fiv", type: "uint16"},
        {name: "six", type: "uint32"}
      ]
    },
    {
      type: "record",
      of: [
        {name: "one", type: "int"},
        {name: "two", type: "int"},
        {name: "three", type: "int"},
        {name: "four", type: "int"},
        {name: "fiv", type: "int"},
        {name: "six", type: "int"}
      ]
    }
  )
})

test("convert to count", () => {
  assertConversion({type: "array", of: "uint64"}, {type: "array", of: "count"})
})

test("convert to double", () => {
  assertConversion(
    {type: "union", of: ["float64", "ip"]},
    {type: "union", of: ["double", "addr"]}
  )
})

test("convert to addr", () => {
  assertConversion("ip", "addr")
})

test("convert to subnet", () => {
  assertConversion({type: "set", of: "net"}, {type: "set", of: "subnet"})
})

test("convert to interval", () => {
  assertConversion("duration", "interval")
})

test("convert to string", () => {
  assertConversion("bstring", "string")
})

test("convert to enum", () => {
  assertConversion("zenum", "enum")
})

test("all other types passthrough", () => {
  assertConversion("port", "port")
})

test("nested types", () => {
  assertConversion(
    {
      type: "record",
      of: [
        {
          name: "id",
          type: "record",
          of: [
            {name: "orig_h", type: "ip"},
            {name: "resp_h", type: "ip"}
          ]
        },
        {name: "orig_bytes", type: "uint64"}
      ]
    },
    {
      type: "record",
      of: [
        {
          name: "id",
          type: "record",
          of: [
            {name: "orig_h", type: "addr"},
            {name: "resp_h", type: "addr"}
          ]
        },
        {name: "orig_bytes", type: "count"}
      ]
    }
  )
})
