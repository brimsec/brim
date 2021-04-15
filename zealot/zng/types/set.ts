import {constructType} from "../construct"
import * as zjson from "../../zjson"
import {Type, ZngClass} from "../ts-types"

export class Set implements ZngClass<Type[] | null> {
  constructor(
    readonly type: zjson.Type,
    readonly value: zjson.Value[] | null
  ) {}

  isSet() {
    return this.value !== null
  }

  toString() {
    return "[Set]"
  }

  getType() {
    return `set[${this.type}]`
  }

  getValue() {
    if (this.value === null) return null
    return this.value.map((val) => constructType(this.type, val))
  }

  at(index: number) {
    if (this.value === null) throw new Error("Set is unset")
    if (index > this.value.length - 1)
      throw new Error(`Index out of bounds: ${index}`)
    return constructType(this.type, this.value[index])
  }

  serialize() {
    return {
      type: {
        type: "set",
        of: this.type
      } as zjson.Type,
      value: this.value
    }
  }
}
