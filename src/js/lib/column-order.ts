import {$Column} from "../state/Columns/models/column"

const EXCLUDED = ["ts", "event_type", "_path"]

export default (cols: $Column[]) => {
  let orderedCols = cols.filter(({name}) => !EXCLUDED.includes(name))
  const ts = cols.find(({name}) => name === "ts")
  const eventType = cols.find(({name}) => name === "event_type")
  const path = cols.find(({name}) => name === "_path")

  if (eventType) orderedCols = [eventType, ...orderedCols]
  if (path) orderedCols = [path, ...orderedCols]
  if (ts) orderedCols = [ts, ...orderedCols]
  return orderedCols
}
