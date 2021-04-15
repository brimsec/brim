import * as zjson from "../../zjson"
import {ZngClass} from "../ts-types"

export class Primitive implements ZngClass<null | string> {
  constructor(readonly type: zjson.Primitive, readonly value: string | null) {}

  isSet() {
    return this.value !== null
  }

  toString() {
    return this.value || ""
  }

  getType() {
    return this.type
  }

  getValue() {
    return this.value
  }

  toDate() {
    if (this.value === null || this.type != "time") {
      throw new Error(`Cannot make type: ${this.type} into a Date`)
    }
    return new Date(+this.value * 1000)
  }

  toFloat() {
    if (this.type != "interval") {
      throw new Error(`Cannot make type: ${this.type} into a Float`)
    }
    if (this.value === null) {
      return 0
    }
    return parseFloat(this.value)
  }

  toInt() {
    if (this.value === null) throw new Error("value is unset")
    const int = parseInt(this.value)
    if (isNaN(int)) {
      throw new Error(`Cannot make type: ${this.type} into an Integer`)
    }
    return int
  }

  serialize() {
    return {
      type: this.type as zjson.Type,
      value: this.value
    }
  }
}
