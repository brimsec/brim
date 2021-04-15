import {Column} from "../types"

export default (col: Column) => {
  return `${col.name}:${col.type}`
}
