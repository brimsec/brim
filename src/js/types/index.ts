import {SpanArgs} from "../state/Search/types"
import {TimeUnit} from "../lib"
import AppError from "../models/app-error"
import {MenuItemConstructorOptions} from "electron"
import {zng} from "zealot"

export type Notification =
  | AppError
  | {
      type: string
      data: any
      key: string
    }

export type Column = {type: string; name: string}
export type Descriptor = Column[]
export type Descriptors = {
  [key: string]: Descriptor
}
export type Tuple = string[]
export type Tuples = Tuple[]
export type TupleSet = {descriptors: Descriptors; tuples: Tuples}

export type ViewerDimens = {
  rowHeight: number
  rowWidth: number | "auto"
  viewHeight: number
  viewWidth: number
  listHeight: number
  listWidth: number | "auto"
}

export type RowRenderer = (arg0: number, arg1: ViewerDimens) => any

export type HashCorrelation = {
  name: "hash" | "tx" | "rx" | "md5"
  data: {tuples: Tuple[]; descriptor: Descriptor}
}

export type UidCorrelation = {
  name: "uid"
  data: Tuple[]
}

export type BoomSearchStats = {
  updateTime: number
  startTime: number
  bytesMatched: number
  bytesRead: number
  tuplesMatched: number
  tuplesRead: number
}

export type Correlation = HashCorrelation | UidCorrelation
export type LogCorrelations = {
  uid?: Tuple[]
  md5?: {tuples: Tuple[]; descriptor: Descriptor}
  tx?: {tuples: Tuple[]; descriptor: Descriptor}
  rx?: {tuples: Tuple[]; descriptor: Descriptor}
}

export type RelatedLogs = {
  [key: string]: zng.Record[]
}

export type RightClickBuilder = (
  field: zng.Field,
  record: zng.Record,
  compound: boolean
) => MenuItemConstructorOptions[]

export type Results = {
  tuples: Tuple[]
  descriptor: Descriptor
}

export type Interval = {
  number: number
  unit: LongTimeUnit
  roundingUnit: TimeUnit
}

export type LongTimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"

export type ScrollPosition = {
  x: number
  y: number
}

export type SearchRecord = {
  program: string
  pins: string[]
  spanArgs: SpanArgs
  spaceId: string
  spaceName: string
  scrollPos?: ScrollPosition
  target?: string // deprecated
}
