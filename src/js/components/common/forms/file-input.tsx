import React, {useState, ChangeEvent} from "react"
import classNames from "classnames"

import TextInput from "./text-input"
import invoke from "../../../electron/ipc/invoke"
import ipc from "../../../electron/ipc"
import useCallbackRef from "../../hooks/use-callback-ref"
import useDropzone from "../../hooks/use-dropzone"

type Props = {
  defaultValue?: string
  name?: string
  placeholder?: string
  onChange?: Function
  isDirInput?: boolean
  textInputProps?: Object
}

export default function FileInput(props: Props) {
  const [picker, ref] = useCallbackRef<HTMLButtonElement>()
  const [bindDropzone, dragging] = useDropzone(onDrop)
  const [value, setValue] = useState(props.defaultValue)

  function update(path) {
    props.onChange && props.onChange(path)
    setValue(path)
  }

  function openDirPicker() {
    invoke(ipc.windows.openDirectorySelect()).then(({canceled, filePaths}) => {
      if (canceled) return
      update(filePaths[0])
    })
  }

  function openFilePicker() {
    picker && picker.click()
  }

  function onButtonClick(e) {
    e && e.preventDefault()
    props.isDirInput ? openDirPicker() : openFilePicker()
  }

  function onTextChange(e) {
    update(e.target.value)
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const path = Array.from(e.target.files).map((f) => f.path)[0]
    update(path)
  }

  function onDrop(e: DragEvent) {
    const path = Array.from(e.dataTransfer.files).map((f) => f.path)[0]
    update(path)
  }

  return (
    <div className="file-input">
      <button
        type="button"
        className={classNames({dragging})}
        onClick={onButtonClick}
        {...bindDropzone()}
      >
        Choose...
      </button>
      <TextInput
        name={props.name}
        type="text"
        value={value}
        onChange={onTextChange}
        placeholder={props.placeholder}
        {...props.textInputProps}
      />
      <input
        ref={ref}
        type="file"
        style={{display: "none"}}
        onChange={onPick}
      />
    </div>
  )
}
