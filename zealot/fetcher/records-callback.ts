import * as zjson from "../zjson"
import * as zng from "../zng"
import * as zqd from "../zqd"

export interface RecordsCallbackArgs {
  channel: number
  schemas: SchemaMap
  newRecords: zng.Record[]
  allRecords: zng.Record[]
}
type SchemaMap = Map<number, zng.Schema>
type ChannelMap = Map<number, Channel>
type Channel = {records: zng.Record[]; schemas: SchemaMap}
type RecordsCallback = (args: RecordsCallbackArgs) => void
type PayloadCallback = (payload: zqd.SearchRecords) => void

function getChannel(id: number, channels: ChannelMap): Channel {
  if (!channels.has(id)) {
    channels.set(id, {
      records: [],
      schemas: new Map<number, zng.Schema>()
    } as Channel)
  }
  return channels.get(id) as Channel
}

function createRecords(
  nextRecords: zjson.Items,
  prevSchemas: SchemaMap
): Channel {
  const schemas = new Map(prevSchemas)
  const records = nextRecords.map((r) => {
    if (r.schema) {
      schemas.set(r.id, new zng.Schema(r.schema.of))
    }
    const schema = schemas.get(r.id)
    if (!schema) throw new Error("No Schema Present for ID: " + r.id)
    return new zng.Record(schema.columns, r.values)
  })

  return {records, schemas}
}

export function createRecordsCallback(cb: RecordsCallback): PayloadCallback {
  let channels = new Map<number, any>()

  return ({channel_id: id, records}: zqd.SearchRecords) => {
    const prev = getChannel(id, channels)
    const next = createRecords(records, prev.schemas)
    const chan = {
      records: [...prev.records, ...next.records],
      schemas: next.schemas
    }
    channels.set(id, chan)
    cb({
      channel: id,
      schemas: chan.schemas,
      newRecords: next.records,
      allRecords: chan.records
    })
  }
}
