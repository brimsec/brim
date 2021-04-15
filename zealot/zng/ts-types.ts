import {Record} from "./types/record"
import {ZArray} from "./types/array"
import {Union} from "./types/union"
import {Primitive} from "./types/primitive"
import {Set} from "./types/set"
import {zjson} from ".."

export type Type = Record | ZArray | Set | Union | Primitive
export type Container = Record | ZArray | Set | Union

export type SerializedData = {
  readonly type: zjson.Type
  readonly value: zjson.Value
}

export interface ZngClass<ValueType> {
  toString(): string
  getType(): string
  getValue(): ValueType
  isSet(): boolean
  serialize(): SerializedData
}
