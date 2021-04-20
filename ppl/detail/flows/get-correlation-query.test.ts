import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {createRecord} from "test/factories/record"
import {ZedPrimitive} from "zealot/zed"
import {getCorrelationQuery} from "./get-correlation-query"

test("returns uid query if ts and duration are missing", () => {
  const record = createRecord({
    _path: "conn",
    uid: "CHem0e2rJqHiwjhgq7",
    community_id: "1:NYgcI8mLerCC20GwJVV5AftL0uY="
  })

  expect(getCorrelationQuery(record)).toBe(
    uidCorrelation(record.get("uid") as ZedPrimitive)
  )
})

test("returns conn query if ts and duration are present", () => {
  const record = createRecord({
    _path: "conn",
    uid: "CHem0e2rJqHiwjhgq7",
    community_id: "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    ts: new Date(1585852166.003543 * 1000),
    duration: null
  })
  expect(getCorrelationQuery(record)).toBe(
    connCorrelation(
      record.get("uid") as ZedPrimitive,
      record.get("community_id") as ZedPrimitive,
      record.get("ts") as ZedPrimitive,
      record.get("duration") as ZedPrimitive
    )
  )
})

test("returns cid query if only cid present", () => {
  const record = createRecord({
    _path: "conn",
    community_id: "1:NYgcI8mLerCC20GwJVV5AftL0uY=",
    ts: new Date(1585852166.003543 * 1000),
    duration: null
  })

  expect(getCorrelationQuery(record)).toBe(
    cidCorrelation(record.get("community_id") as ZedPrimitive)
  )
})

test("returns null if no cid or uid", () => {
  const record = createRecord({
    _path: "conn",
    ts: new Date(1585852166.003543 * 1000),
    duration: null
  })

  expect(getCorrelationQuery(record)).toBe(null)
})
