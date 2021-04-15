import React from "react"

import {FormFieldConfig} from "../../brim/form"
import InputLabel from "../common/forms/input-label"
import SelectInput from "../common/forms/select-input"
import brim from "../../brim"

type Props = {config: FormFieldConfig}

export default function Timezone({config}: Props) {
  const {label, name, defaultValue} = config
  return (
    <div className="setting-panel">
      <InputLabel>{label}</InputLabel>
      <SelectInput name={name} defaultValue={defaultValue}>
        {brim.time.getZoneNames().map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}
