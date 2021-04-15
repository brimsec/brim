import * as zjson from "../../zjson"
import {constructType} from "../construct"
import {Type, ZngClass} from "../ts-types"

export class Union implements ZngClass<Type[] | null> {
  constructor(
    readonly type: zjson.Type[],
    readonly value: zjson.Value[] | null
  ) {}

  isSet() {
    return this.value !== null
  }

  toString() {
    return "[Union]"
  }

  getType() {
    return `union[${this.type.join(",")}]`
  }

  getValue() {
    if (this.value === null) return null
    return this.value.map((val) => {
      if (typeof val != "string") {
        throw new Error(`Complex values in union: ${JSON.stringify(val)}`)
      }
      const [i, value] = val.split(":")
      return constructType(this.type[parseInt(i)], value)
    })
  }

  at(index: number) {
    if (this.value === null) throw new Error("Set is unset")
    if (index > this.value.length - 1)
      throw new Error(`Index out of bounds: ${index}`)

    const val = this.value[index]
    if (typeof val != "string") {
      throw new Error(`Complex values in union: ${JSON.stringify(val)}`)
    }

    const [i, value] = val.split(":")
    return constructType(this.type[parseInt(i)], value)
  }

  serialize() {
    return {
      type: {
        type: "union",
        of: this.type
      } as zjson.Type,
      value: this.value
    }
  }
}
