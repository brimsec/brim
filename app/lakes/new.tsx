import {useDispatch} from "react-redux"
import React, {useState} from "react"
import styled from "styled-components"

import {createSpace} from "../../src/js/flows/create-space"
import ErrorFactory from "../../src/js/models/error-factory"
import FileInput from "../../src/js/components/common/forms/file-input"
import InputField from "../../src/js/components/common/forms/input-field"
import InputLabel from "../../src/js/components/common/forms/input-label"
import Notice from "../../src/js/state/Notice"
import PrimaryButton from "../../src/js/components/common/buttons/primary-button"
import SelectInput from "../../src/js/components/common/forms/select-input"
import TextInput from "../../src/js/components/common/forms/text-input"
import {AppDispatch} from "../../src/js/state/types"

const Wrap = styled.section`
  max-width: 460px;
  width: 100%;
  margin: 0 auto;
`

const FormWrap = styled.form`
  ${InputField} {
    margin-bottom: 18px;
  }
`

const SubmitWrap = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
`

export default function TabCreateSpace() {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState("")
  const [kind, setKind] = useState<"filestore" | "archivestore">("filestore")
  const [data_path, setDataPath] = useState("")

  const onSubmit = (e) => {
    dispatch(createSpace({name, kind, data_path})).catch((e) => {
      dispatch(Notice.set(ErrorFactory.create(e)))
    })
    e.preventDefault()
  }

  return (
    <Wrap>
      <h2>Create Space</h2>
      <FormWrap onSubmit={onSubmit}>
        <InputField>
          <InputLabel>Name</InputLabel>
          <TextInput
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputField>

        <InputField>
          <InputLabel>Storage</InputLabel>
          <SelectInput value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="filestore">File Store</option>
            <option value="archivestore">Archive Store</option>
          </SelectInput>
        </InputField>

        <InputField>
          <InputLabel>Data Directory</InputLabel>
          <FileInput
            isDirInput={true}
            placeholder="default"
            defaultValue={data_path}
            onChange={(path) => setDataPath(path)}
          />
        </InputField>

        <SubmitWrap>
          <PrimaryButton>Create</PrimaryButton>
        </SubmitWrap>
      </FormWrap>
    </Wrap>
  )
}
