import React from "react"

import {FormFieldConfig} from "../../brim/form"
import FileInput from "../common/forms/file-input"
import InputLabel from "../common/forms/input-label"

type Props = {
  config: FormFieldConfig
}

export default function DataDirInput({config}: Props) {
  const {name, label, defaultValue} = config
  return (
    <div className="setting-panel">
      <InputLabel>{label}</InputLabel>
      <FileInput isDirInput {...{name, defaultValue, placeholder: "default"}} />
    </div>
  )
}
