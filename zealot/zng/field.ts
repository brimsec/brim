import {constructType} from "./construct"
import {Container, SerializedData, Type} from "./ts-types"

export interface ContainerField {
  name: string
  data: Container
}

export type SerializedField = {
  name: string
  data: SerializedData
}

export class Field {
  constructor(readonly name: string, readonly data: Type) {}

  static deserialize(object: SerializedField): Field {
    return new Field(
      object.name,
      constructType(object.data.type, object.data.value)
    )
  }

  serialize(): SerializedField {
    return {
      name: this.name,
      data: this.data.serialize()
    }
  }
}
