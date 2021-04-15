import React, {useEffect, useState} from "react"
import AutosizeInput from "react-input-autosize"
import useCallbackRef from "../hooks/use-callback-ref"
import useEnterKey from "../hooks/use-enter-key"
import useEscapeKey from "../hooks/use-escape-key"
import useListener from "../hooks/use-listener"

export default function PinEdit({onSubmit, onBlur, onCancel, defaultValue}) {
  const [value, setValue] = useState(defaultValue)
  const [input, setInput] = useCallbackRef<HTMLInputElement>()
  useEnterKey(() => onSubmit(value))
  useEscapeKey(onCancel)
  useListener(input, "blur", () => onBlur(value))

  function onChange(e) {
    setValue(e.target.value)
  }

  useEffect(() => {
    if (input) input.select()
  }, [input])

  return (
    <AutosizeInput
      inputRef={setInput}
      value={value}
      onChange={onChange}
      style={{
        minHeight: "17px",
        marginRight: "12px",
        display: "inline-flex",
        marginBottom: "3px"
      }}
      inputStyle={{fontSize: "9px", fontFamily: "Cartograph"}}
    />
  )
}
