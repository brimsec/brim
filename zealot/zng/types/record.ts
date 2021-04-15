import * as zjson from "../../zjson"
import {constructType} from "../construct"
import {Field} from "../field"
import {Type, ZngClass} from "../ts-types"

class UnknownColumnError extends Error {
  constructor(unknown: string, names: string[]) {
    const available = names.map((n) => `"${n}"`).join(", ")
    super(`"${unknown}" not present in [${available}]`)
  }
}

export type SerializedRecord = {
  type: zjson.Record
  value: zjson.Value[] | null
}

export class Record implements ZngClass<Type[] | null> {
  constructor(
    readonly type: zjson.Column[],
    readonly value: zjson.Value[] | null
  ) {}

  static deserialize({type, value}: SerializedRecord): Record {
    return new Record(type.of, value)
  }

  isSet() {
    return this.value !== null
  }

  getType() {
    return "record:[<cols...>]"
  }

  getValue() {
    if (!this.isSet()) return null
    return this.type.map((_, i) => this.at(i))
  }

  toString() {
    return JSON.stringify(this.value)
  }

  getColumns() {
    return this.type
  }

  getColumnNames() {
    return this.type.map((c) => c.name)
  }

  at(index: number) {
    const col = this.type[index]
    if (!col) throw new Error(`No column at index: ${index}`)
    const val = this.isSet() ? this.value![index] : null
    const type = "of" in col ? col : col.type
    return constructType(type, val)
  }

  has(name: string) {
    const col = this.type.find((c) => c.name == name)
    return !!col
  }

  get(name: string): Type {
    return name.split(".").reduce<Type>((data: Type, name: string) => {
      if (data instanceof Record) {
        return data.getOne(name)
      } else {
        throw new Error("Dot syntax is only for nested records")
      }
    }, this)
  }

  private getOne(name: string): Type {
    if (!this.isSet()) throw new Error("Record is unset")
    const col = this.type.find((c) => c.name == name)
    if (!col) {
      throw new UnknownColumnError(name, this.getColumnNames())
    } else {
      const val = this.value![this.type.indexOf(col)]
      const type = "of" in col ? col : col.type
      return constructType(type, val)
    }
  }

  try(name: string) {
    try {
      return this.get(name)
    } catch (_) {
      return null
    }
  }

  getField(name: string): Field {
    return new Field(name, this.get(name))
  }

  tryField(name: string): Field | null {
    try {
      return this.getField(name)
    } catch (_) {
      return null
    }
  }

  getFields(): Field[] {
    return this.type.map(({name}, i) => new Field(name, this.at(i)))
  }

  flatten(prefix = ""): Record {
    let cols: zjson.Column[] = []
    let vals: zjson.Value[] = []

    this.type.forEach((column, index) => {
      if (column.type === "record") {
        const nested = (this.at(index) as Record).flatten(column.name + ".")
        cols = cols.concat(nested.type)
        vals = vals.concat(nested.value)
      } else {
        cols.push({...column, name: prefix + column.name})
        // For an unset record, supply an unset value for each column.
        vals.push(this.isSet() ? this.value![index] : null)
      }
    })
    return new Record(cols, vals)
  }

  serialize(): SerializedRecord {
    return {
      type: {
        type: "record",
        of: this.type
      } as zjson.Record,
      value: this.value
    }
  }
}
