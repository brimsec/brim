import React from "react"

import {FormFieldConfig} from "../../brim/form"
import {jsonTypeConfigInput} from "../../test/locators"
import FileInput from "../common/forms/file-input"
import InputLabel from "../common/forms/input-label"
import Link from "../common/Link"

type Props = {
  config: FormFieldConfig
}

export const JSON_TYPE_CONFIG_DOCS =
  "https://github.com/brimdata/brim/wiki/Zeek-JSON-Import"

export default function JSONTypeConfig({config}: Props) {
  const {name, label, defaultValue} = config
  return (
    <div className="setting-panel">
      <InputLabel>
        {label} <Link href={JSON_TYPE_CONFIG_DOCS}>docs</Link>
      </InputLabel>
      <FileInput
        {...{name, defaultValue, placeholder: "default"}}
        textInputProps={jsonTypeConfigInput.props}
      />
    </div>
  )
}
