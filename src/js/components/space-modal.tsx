import {useDispatch, useSelector} from "react-redux"
import React, {useState, useEffect} from "react"

import {reactElementProps} from "../test/integration"
import InputField from "./common/forms/input-field"
import InputLabel from "./common/forms/input-label"
import InputLabelError from "./common/forms/input-label-error"
import Modal from "../state/Modal"
import ModalBox from "./ModalBox/modal-box"
import Spaces from "../state/Spaces"
import TextInput from "./common/forms/text-input"
import renameSpace from "../flows/rename-space"
import {AppDispatch} from "../state/types"

export default function SpaceModal() {
  const args = useSelector(Modal.getArgs) || {}
  const {workspaceId, spaceId} = args
  const space = useSelector(Spaces.get(workspaceId, spaceId))
  const {name} = space || {name: ""}
  const [nameInput, setNameInput] = useState(name)
  const [error, setError] = useState(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setNameInput(name)
  }, [name])

  const onSubmit = () => {
    setError(null)
    dispatch(renameSpace(workspaceId, spaceId, nameInput))
      .then(() => {
        dispatch(Modal.hide())
      })
      .catch((e) => {
        setError(e.error)
      })
  }

  return (
    <ModalBox
      name="space"
      title=""
      buttons={[{label: "OK", click: onSubmit}]}
      className="space-modal"
      {...reactElementProps("spaceModal")}
    >
      <SpaceModalContents
        value={nameInput}
        onChange={setNameInput}
        error={error}
      />
    </ModalBox>
  )
}

const SpaceModalContents = ({value, onChange, error}) => {
  return (
    <div className="space-modal-contents">
      <InputField>
        <InputLabel>
          New Name
          {error && <InputLabelError> Error: {error}</InputLabelError>}
        </InputLabel>
        <TextInput
          autoFocus
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      </InputField>
    </div>
  )
}
