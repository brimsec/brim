import {zng} from "zealot"

import {createComplexCell} from "./complex-cell"
import {createPrimitiveCell} from "./primitive-cell"

export interface Cell {
  name: string
  queryableValue: () => string
  stringValue: () => string
  display: () => string
  compound: () => boolean
  guessWidth: () => number
}

export function createCell({name, data}: zng.Field): Cell {
  if (data instanceof zng.Primitive) {
    return createPrimitiveCell({name, data})
  } else {
    return createComplexCell({name, data})
  }
}
