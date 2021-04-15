import {nanoid} from "@reduxjs/toolkit"
import {isEmpty} from "lodash"
import React, {useEffect, useRef, useState} from "react"
import {useDispatch} from "react-redux"
import styled from "styled-components"
import brim, {BrimWorkspace} from "../../brim"
import {FormConfig} from "../../brim/form"
import {buildAndAuthenticateWorkspace} from "../../flows/workspace/build-and-authenticate-workspace"
import {isDefaultWorkspace} from "../../initializers/init-workspace-params"
import {AppDispatch} from "../../state/types"
import {Workspace} from "../../state/Workspaces/types"
import InputField from "../common/forms/input-field"
import InputLabel from "../common/forms/input-label"
import TextInput from "../common/forms/text-input"
import useCallbackRef from "../hooks/use-callback-ref"
import useEventListener from "../hooks/use-event-listener"
import MacSpinner from "../mac-spinner"
import ToolbarButton from "../../../../app/toolbar/button"

const SignInForm = styled.div`
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

    &:last-child {
      margin: 0;
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
  width: 280px;
`

type Props = {
  workspace?: BrimWorkspace
  onClose: () => void
}

const WorkspaceForm = ({onClose, workspace}: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const [errors, setErrors] = useState([])
  const [formRef, setFormRef] = useCallbackRef<HTMLFormElement>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {current: id} = useRef((workspace && workspace.id) || nanoid())
  const ctlRef = useRef(new AbortController())
  const isNewWorkspace = !workspace

  useEffect(() => () => ctlRef.current.abort(), [])

  const config: FormConfig = {
    host: {
      name: "host",
      label: "Host",
      check: (value) => {
        if (isEmpty(value)) return [false, "must not be blank"]
        let isValid = true
        if (!isNewWorkspace && isDefaultWorkspace(workspace)) {
          const {host, port} = workspace
          isValid = value === host || value === [host, port].join(":")
        }
        return [isValid, "cannot change host of default workspace"]
      }
    },
    name: {
      name: "name",
      label: "Name",
      check: (value) => [!isEmpty(value), "must not be blank"]
    }
  }

  const setFields = ({hostPort, name}, ws?: Workspace): Partial<Workspace> => {
    let [host, port] = hostPort.split(":")
    if (!port) port = "9867"
    if (ws) return {...ws, host, port, name}
    return {id, host, port, name}
  }

  const onClickClose = () => {
    setErrors([])
    onClose()
  }

  const onCancel = () => {
    ctlRef.current.abort()
  }

  const onSave = async () => {
    if (!formRef) return
    setIsSubmitting(true)

    const form = brim.form(formRef, config)

    if (!(await form.isValid())) {
      setErrors(form.getErrors)
      setIsSubmitting(false)
      return
    }

    const {host, name} = form.getFields().reduce((obj, field) => {
      obj[field.name] = field.value
      return obj
    }, {})
    const newWs = setFields(
      {
        hostPort: host,
        name
      },
      workspace
    )

    try {
      ctlRef.current = new AbortController()
      const [cancelled, error] = await dispatch(
        buildAndAuthenticateWorkspace(newWs, ctlRef.current.signal)
      )
      setIsSubmitting(false)

      if (error) {
        setErrors([error.message])
        return
      }
      setErrors([])

      // user elected to cancel at dialog or mid-login
      if (cancelled) return

      // success
      onClose()
    } catch (e) {
      console.error(e)
      setIsSubmitting(false)
      setErrors([{message: "Failed to add Workspace"}])
    }
  }

  function keyUp(e) {
    if (e.key === "Enter") {
      e.stopPropagation()
      e.preventDefault()
      onSave()
    }
  }

  useEventListener(document, "keyup", keyUp, [formRef])

  const defaultName = (workspace && workspace.name) || ""
  const defaultHost =
    (workspace && [workspace.host, workspace.port].join(":")) || ""

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
      <SignInForm>
        <form ref={setFormRef}>
          <InputField>
            <InputLabel>{config.name.label}</InputLabel>
            <StyledTextInput
              name={config.name.name}
              defaultValue={defaultName}
              disabled={isSubmitting}
              autoFocus
            />
          </InputField>
          <InputField>
            <InputLabel>{config.host.label}</InputLabel>
            <StyledTextInput
              name={config.host.name}
              defaultValue={defaultHost}
              disabled={isSubmitting}
            />
          </InputField>
        </form>
      </SignInForm>
      <StyledFooter>
        <ToolbarButton
          isPrimary
          text={isSubmitting ? "" : isNewWorkspace ? "Connect" : "Save"}
          icon={isSubmitting ? <MacSpinner light /> : null}
          disabled={isSubmitting}
          onClick={onSave}
        />
        <ToolbarButton
          text={isSubmitting ? "Cancel" : "Close"}
          onClick={isSubmitting ? onCancel : onClickClose}
        />
      </StyledFooter>
    </>
  )
}

export default WorkspaceForm
