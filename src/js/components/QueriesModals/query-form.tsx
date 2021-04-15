import React, {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {isEmpty, get} from "lodash"
import {nanoid} from "@reduxjs/toolkit"
import InputField from "../common/forms/input-field"
import InputLabel from "../common/forms/input-label"
import TextInput from "../common/forms/text-input"
import styled from "styled-components"
import {FormConfig} from "../../brim/form"
import brim from "../../brim"
import useCallbackRef from "../hooks/use-callback-ref"
import ToolbarButton from "../../../../app/toolbar/button"
import useEventListener from "../hooks/use-event-listener"
import {Query} from "../../state/Queries/types"
import Queries from "../../state/Queries"
import {cssVar} from "../../lib/css-var"

const QueryFormWrapper = styled.div`
  width: 100%;
  margin: 0 auto 24px;
  padding-left: 24px;

  ${InputField} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 18px;

    input {
      background: rgba(255, 255, 255, 0.83);
    }

    &:not(:first-child) {
      margin-left: 30px;
      margin-right: 30px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  ${InputLabel} {
    margin-bottom: 0;
    margin-right: 10px;
  }
`

const Errors = styled.ul`
  list-style: none;
  margin: 0 0 12px;
  line-height: 1.5;

  a {
    color: var(--red);
    cursor: pointer;
    text-decoration: underline;
  }

  p {
    ${(p) => p.theme.typography.labelSmall}
    margin: 0;
  }
`

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  background: transparent;
  margin-bottom: 12px;

  button {
    margin-left: 12px;
  }
`

const StyledTextInput = styled(TextInput)`
  width: 350px;
`

const QueryValueInput = styled(TextInput)`
  outline: none;
  font-family: ${cssVar("--mono-font")};
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  letter-spacing: 0px;
  border-radius: 15px;
  margin-bottom: 12px;
`

type Props = {
  query?: Query
  value?: string
  onClose: () => void
}

const QueryForm = ({onClose, query, value}: Props) => {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState([])
  const [formRef, setFormRef] = useCallbackRef<HTMLFormElement>()
  const queriesRoot = useSelector(Queries.getRaw)

  const config: FormConfig = {
    value: {
      name: "value",
      label: "",
      check: (value) => [!isEmpty(value), "must not be blank"]
    },
    name: {
      name: "name",
      label: "Name",
      check: (value) => [!isEmpty(value), "must not be blank"]
    },
    description: {
      name: "description",
      label: "Desc"
    },
    tags: {
      name: "tags",
      label: "Tags"
    }
  }

  const onCancel = () => {
    setErrors([])
    onClose()
  }

  const onSave = async () => {
    if (!formRef) return

    const form = brim.form(formRef, config)

    if (await form.isValid()) {
      const {value, name, description, tags} = form
        .getFields()
        .reduce((obj, field) => {
          obj[field.name] = field.value
          return obj
        }, {})

      const splitTags = tags ? tags.split(", ") : []
      const newQuery = {
        value,
        name,
        description,
        tags: splitTags
      }
      // editing query
      if (query) {
        const {id} = query
        dispatch(
          Queries.editItem(
            {
              id,
              ...newQuery
            },
            id
          )
        )
        // adding query
      } else {
        dispatch(
          Queries.addItem(
            {
              id: nanoid(),
              ...newQuery
            },
            queriesRoot
          )
        )
      }
    } else {
      setErrors(form.getErrors)
      return
    }

    setErrors([])
    onClose()
  }

  function keyUp(e) {
    if (e.key === "Enter") {
      e.stopPropagation()
      e.preventDefault()
      onSave()
    }
  }

  useEventListener(document, "keyup", keyUp, [formRef])

  return (
    <>
      {errors.length > 0 && (
        <Errors>
          {errors.map(({label, message, input}, i) => (
            <li key={i}>
              <a onClick={() => input.focus()}>{label}</a> {message}
            </li>
          ))}
        </Errors>
      )}
      <QueryFormWrapper>
        <form ref={setFormRef}>
          <InputField>
            <QueryValueInput
              name={config.value.name}
              defaultValue={value || get(query, ["value"], "")}
              autoFocus
            />
          </InputField>
          <InputField>
            <InputLabel>{config.name.label}</InputLabel>
            <StyledTextInput
              name={config.name.name}
              defaultValue={get(query, ["name"], "")}
            />
          </InputField>
          <InputField>
            <InputLabel>{config.description.label}</InputLabel>
            <StyledTextInput
              name={config.description.name}
              defaultValue={get(query, ["description"], "")}
            />
          </InputField>
          <InputField>
            <InputLabel>{config.tags.label}</InputLabel>
            <StyledTextInput
              name={config.tags.name}
              defaultValue={get(query, ["tags"], []).join(", ")}
            />
          </InputField>
        </form>
      </QueryFormWrapper>
      <StyledFooter>
        <ToolbarButton isPrimary text="Save" onClick={onSave} />
        <ToolbarButton text="Cancel" onClick={onCancel} />
      </StyledFooter>
    </>
  )
}

export default QueryForm
