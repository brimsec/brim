import {createCell} from "./cell"
import {zng} from "zealot"
import {ONE_CHAR} from "./primitive-cell"

export const COMPOUND_FIELD_RGX = /^(set|array|union|record)$/

export type ComplexCell = ReturnType<typeof createComplexCell>

export function createComplexCell({name, data}: zng.ContainerField) {
  const items = (data.getValue() || []).map((v, i) =>
    createCell({name: name + "." + i, data: v} as zng.Field)
  )

  return {
    name,
    container: data.constructor.name,
    length: items.length,
    item: (index: number) => items[index],
    queryableValue() {
      return items.map((cell) => cell.queryableValue()).join(" ")
    },
    display() {
      return items.map((cell) => cell.display()).join(", ")
    },
    stringValue() {
      return data.toString()
    },
    compound() {
      return true
    },
    guessWidth() {
      const comma = ONE_CHAR
      const wrap = 2 * ONE_CHAR
      let sum = 0
      for (const item of items) {
        sum += item.guessWidth()
      }
      sum += comma * (items.length - 1)
      sum += wrap
      return sum
    }
  }
}
