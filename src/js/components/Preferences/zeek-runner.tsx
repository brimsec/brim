import React, {useState} from "react"

import {FormFieldConfig} from "../../brim/form"
import FileInput from "../common/forms/file-input"
import InputLabel from "../common/forms/input-label"
import Link from "../common/Link"

type Props = {
  config: FormFieldConfig
}

const DOCS = "https://github.com/brimdata/brim/wiki/Zeek-Customization"

export default function ZeekRunner({config}: Props) {
  const {name, label, defaultValue} = config
  const [showFeedback, setShowFeedback] = useState(false)

  function onChange(val) {
    setShowFeedback(val !== defaultValue)
  }

  return (
    <div className="setting-panel">
      <InputLabel>
        {label} <Link href={DOCS}>docs</Link>
      </InputLabel>
      <FileInput
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder="default"
      />
      {showFeedback ? <p className="feedback">Restart required.</p> : null}
    </div>
  )
}
