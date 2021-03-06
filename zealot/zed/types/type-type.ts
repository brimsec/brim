import {isNull} from "../utils"
import {TypeValue} from "../values/type"
import {BasePrimitive} from "./base-primitive"

export class TypeOfType extends BasePrimitive<TypeValue> {
  name = "type"

  create(value: string | null, typedefs) {
    if (isNull(value)) {
      return new TypeValue(null)
    } else {
      return new TypeValue(typedefs[value])
    }
  }

  hasTypeType() {
    return true
  }

  walkTypeValues(ctx, value, visit) {
    visit(value)
  }
}

export const TypeType = new TypeOfType()
