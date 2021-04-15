import React from "react"

import {FormFieldConfig} from "../../brim/form"
import InputLabel from "../common/forms/input-label"
import Link from "../common/Link"
import TextInput from "../common/forms/text-input"

type Props = {config: FormFieldConfig}

const DOCS = "https://momentjs.com/docs/#/displaying/format/"

export default function TimeFormat({config}: Props) {
  return (
    <div className="setting-panel">
      <div>
        <InputLabel>
          {config.label} <Link href={DOCS}>docs</Link>
        </InputLabel>
      </div>
      <TextInput
        name={config.name}
        type="text"
        placeholder="ISO-8601"
        defaultValue={config.defaultValue}
      />
    </div>
  )
}
